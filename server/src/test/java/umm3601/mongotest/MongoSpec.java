package umm3601.mongotest;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Some simple "tests" that demonstrate our ability to
 * connect to a Mongo database and run some basic queries
 * against it.
 * <p>
 * Note that none of these are actually tests of any of our
 * code; they are mostly demonstrations of the behavior of
 * the MongoDB Java libraries. Thus if they test anything,
 * they test that code, and perhaps our understanding of it.
 * <p>
 * To test "our" code we'd want the tests to confirm that
 * the behavior of methods in things like the UserController
 * do the "right" thing.
 * <p>
 * Created by mcphee on 20/2/17.
 */
public class MongoSpec {

  private MongoCollection<Document> userDocuments;
  private MongoCollection<Document> todoDocuments;

  static MongoClient mongoClient;
  static MongoDatabase db;

  @BeforeAll
  public static void setupDB() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  public void clearAndPopulateDB() {
    userDocuments = db.getCollection("users");
    todoDocuments = db.getCollection("todos");
    userDocuments.drop();
    todoDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    List<Document> testTodos = new ArrayList<>();
    testUsers.add(
      new Document()
        .append("name", "Chris")
        .append("age", 25)
        .append("company", "UMM")
        .append("email", "chris@this.that"));
    testUsers.add(
      new Document()
        .append("name", "Pat")
        .append("age", 37)
        .append("company", "IBM")
        .append("email", "pat@something.com"));
    testUsers.add(
      new Document()
        .append("name", "Jamie")
        .append("age", 37)
        .append("company", "Frogs, Inc.")
        .append("email", "jamie@frogs.com"));

     testTodos.add(
      new Document()
          .append("owner", "Chris")
          .append("status", false)
          .append("category", "places")
          .append("body", "hello this is english"));
    testTodos.add(
      new Document()
          .append("owner", "Mat")
          .append("status", true)
          .append("category", "home")
          .append("body", "this isnt english"));
    testTodos.add(
      new Document()
          .append("owner", "Ciara")
          .append("status", false)
          .append("category", "away")
          .append("body", "the body lies"));

    userDocuments.insertMany(testUsers);
    todoDocuments.insertMany(testTodos);
  }

  private List<Document> intoList(MongoIterable<Document> documents) {
    List<Document> users = new ArrayList<>();
    documents.into(users);
    return users;
  }

  private List<Document> intoListTodos(MongoIterable<Document> document) {
    List<Document> todos = new ArrayList<>();
    document.into(todos);
    return todos;
  }




  private int countUsers(FindIterable<Document> documents) {
    List<Document> users = intoList(documents);
    return users.size();
  }
  private int countTodos(FindIterable<Document> document) {
    List<Document> todos = intoList(document);
    return todos.size();
  }

  @Test
  public void shouldBeThreeUsers() {
    FindIterable<Document> documents = userDocuments.find();
    int numberOfUsers = countUsers(documents);
    assertEquals(3, numberOfUsers, "Should be 3 total users");
  }

  @Test
  public void shouldBeThreeTodos() {
    FindIterable<Document> documents = todoDocuments.find();
    int numberOfTodos = countTodos(documents);
    assertEquals(3, numberOfTodos, "Should be 3 total todos");
  }

  @Test
  public void shouldBeOneChris() {
    FindIterable<Document> documents = userDocuments.find(eq("name", "Chris"));
    int numberOfUsers = countUsers(documents);
    assertEquals(1, numberOfUsers, "Should be 1 Chris");
  }
  @Test
  public void shouldBeOneMat() {
    FindIterable<Document> documents = todoDocuments.find(eq("owner", "Mat"));
    int numberOfTodos = countTodos(documents);
    assertEquals(1, numberOfTodos, "Should be 1 Mat");
  }

  @Test
  public void shouldBeTwoOver25() {
    FindIterable<Document> documents = userDocuments.find(gt("age", 25));
    int numberOfUsers = countUsers(documents);
    assertEquals(2, numberOfUsers, "Should be 2 over 25");
  }


  @Test
  public void shouldBeTwoFalse() {
    FindIterable<Document> documents = todoDocuments.find(eq("status", false));
    int numberOfTodos = countTodos(documents);
    assertEquals(2, numberOfTodos, "Should be 2 false");
  }

  @Test
  public void shouldBeOneHome() {
    FindIterable<Document> documents = todoDocuments.find(eq("category", "home"));
    int numberOfTodos = countTodos(documents);
    assertEquals(1, numberOfTodos, "Should be 1 home");
  }

  @Test
  public void shouldBeNoBody() {
    FindIterable<Document> documents = todoDocuments.find(eq("body", "hello my name is dante miller from south dakota"));
    int numberOfTodos = countTodos(documents);
    assertEquals(0, numberOfTodos, "Should be 0 body");
  }

  @Test
  public void over25SortedByName() {
    FindIterable<Document> documents
      = userDocuments.find(gt("age", 25))
      .sort(Sorts.ascending("name"));
    List<Document> docs = intoList(documents);
    assertEquals(2, docs.size(), "Should be 2");
    assertEquals("Jamie", docs.get(0).get("name"), "First should be Jamie");
    assertEquals("Pat", docs.get(1).get("name"), "Second should be Pat");
  }

  @Test
  public void over25AndIbmers() {
    FindIterable<Document> documents
      = userDocuments.find(and(gt("age", 25),
      eq("company", "IBM")));
    List<Document> docs = intoList(documents);
    assertEquals(1, docs.size(), "Should be 1");
    assertEquals("Pat", docs.get(0).get("name"), "First should be Pat");
  }

  @Test
  public void justNameAndEmail() {
    FindIterable<Document> documents
      = userDocuments.find().projection(fields(include("name", "email")));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Chris", docs.get(0).get("name"), "First should be Chris");
    assertNotNull(docs.get(0).get("email"), "First should have email");
    assertNull(docs.get(0).get("company"), "First shouldn't have 'company'");
    assertNotNull(docs.get(0).get("_id"), "First should have '_id'");
  }

  @Test
  public void justNameAndEmailNoId() {
    FindIterable<Document> documents
      = userDocuments.find()
      .projection(fields(include("name", "email"), excludeId()));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Chris", docs.get(0).get("name"), "First should be Chris");
    assertNotNull(docs.get(0).get("email"), "First should have email");
    assertNull(docs.get(0).get("company"), "First shouldn't have 'company'");
    assertNull(docs.get(0).get("_id"), "First should not have '_id'");
  }

  @Test
  public void justNameAndEmailNoIdSortedByCompany() {
    FindIterable<Document> documents
      = userDocuments.find()
      .sort(Sorts.ascending("company"))
      .projection(fields(include("name", "email"), excludeId()));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be 3");
    assertEquals("Jamie", docs.get(0).get("name"), "First should be Jamie");
    assertNotNull(docs.get(0).get("email"), "First should have email");
    assertNull(docs.get(0).get("company"), "First shouldn't have 'company'");
    assertNull(docs.get(0).get("_id"), "First should not have '_id'");
  }

  @Test
  public void ageCounts() {
    AggregateIterable<Document> documents
      = userDocuments.aggregate(
      Arrays.asList(
        /*
         * Groups data by the "age" field, and then counts
         * the number of documents with each given age.
         * This creates a new "constructed document" that
         * has "age" as it's "_id", and the count as the
         * "ageCount" field.
         */
        Aggregates.group("$age",
          Accumulators.sum("ageCount", 1)),
        Aggregates.sort(Sorts.ascending("_id"))
      )
    );
    List<Document> docs = intoList(documents);
    assertEquals(2, docs.size(), "Should be two distinct ages");
    assertEquals(docs.get(0).get("_id"), 25);
    assertEquals(docs.get(0).get("ageCount"), 1);
    assertEquals(docs.get(1).get("_id"), 37);
    assertEquals(docs.get(1).get("ageCount"), 2);
  }

  @Test
  public void averageAge() {
    AggregateIterable<Document> documents
      = userDocuments.aggregate(
      Arrays.asList(
        Aggregates.group("$company",
          Accumulators.avg("averageAge", "$age")),
        Aggregates.sort(Sorts.ascending("_id"))
      ));
    List<Document> docs = intoList(documents);
    assertEquals(3, docs.size(), "Should be three companies");

    assertEquals("Frogs, Inc.", docs.get(0).get("_id"));
    assertEquals(37.0, docs.get(0).get("averageAge"));
    assertEquals("IBM", docs.get(1).get("_id"));
    assertEquals(37.0, docs.get(1).get("averageAge"));
    assertEquals("UMM", docs.get(2).get("_id"));
    assertEquals(25.0, docs.get(2).get("averageAge"));
  }

}
