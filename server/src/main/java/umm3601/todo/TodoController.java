package umm3601.todo;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

/**
 * Controller that manages requests for info about users.
 */
public class TodoController {

  private static final String OWNER_KEY = "owner";
  private static final String STATUS_KEY = "status";
  private static final String BODY_KEY = "body";
  private static final String CATEGORY_KEY = "category";

  private final JacksonMongoCollection<Todo> todoCollection;

  /**
   * Construct a controller for todos.
   *
   * @param database the database containing todo data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(database, "todos", Todo.class);
  }

  /**
   * Get the single user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodo(Context ctx) {
    String id = ctx.pathParam("id");
    Todo todo;

    try {
      todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested todo id wasn't a legal Mongo Object ID.");
    }
    if (todo == null) {
      throw new NotFoundResponse("The requested todo was not found");
    } else {
      ctx.json(todo);
    }
  }

  /**
   * Delete the user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteTodo(Context ctx) {
    String id = ctx.pathParam("id");
    todoCollection.deleteOne(eq("_id", new ObjectId(id)));
  }

  /**
   * Get a JSON response with a list of all the users.
   *
   * @param ctx a Javalin HTTP context
   */
  public void getTodos(Context ctx) {

    List<Bson> filters = new ArrayList<>(); // start with a blank document

    if (ctx.queryParamMap().containsKey(OWNER_KEY)) {
      filters.add(regex(OWNER_KEY,  Pattern.quote(ctx.queryParam(OWNER_KEY)), "i"));
    }
    if (ctx.queryParamMap().containsKey(STATUS_KEY)) {
      filters.add(regex(STATUS_KEY,  Pattern.quote(ctx.queryParam(STATUS_KEY)), "i"));
    }
    if (ctx.queryParamMap().containsKey(BODY_KEY)) {
      filters.add(regex(BODY_KEY,  Pattern.quote(ctx.queryParam(BODY_KEY)), "i"));
    }
    if (ctx.queryParamMap().containsKey(CATEGORY_KEY)) {
      filters.add(regex(CATEGORY_KEY,  Pattern.quote(ctx.queryParam(CATEGORY_KEY)), "i"));
    }

    String sortBy = ctx.queryParam("sortby", "owner"); //Sort by sort query param, default is name
    String sortOrder = ctx.queryParam("sortorder", "asc");

    ctx.json(todoCollection.find(filters.isEmpty() ? new Document() : and(filters))
      .sort(sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy))
      .into(new ArrayList<>()));
  }

  /**
   * Get a JSON response with a list of all the users.
   *
   * @param ctx a Javalin HTTP context
   */
  public void addNewTodo(Context ctx) {
    Todo newTodo = ctx.bodyValidator(Todo.class)
      .check(tdo -> tdo.status != null && (tdo.status.toString().equals("true") || tdo.status.toString().equals("false")))
      .check(tdo -> tdo.category != null && tdo.category.length() > 0)
      .check(tdo -> tdo.body != null && tdo.body.length() > 0)
      .check(tdo -> tdo.owner != null && tdo.owner.length() > 0)
      .get();

    todoCollection.insertOne(newTodo);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newTodo._id));
  }

}
