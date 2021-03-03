import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Todo} from './todo';
import { TodoService } from './todo.service';

describe('Todo service: ', () => {
  // A small collection of test users


  const testTodos: Todo[] = [
    {
      _id: '3434id',
      owner: 'Barry',
      status: true,
      body: 'nostrud esse voluptate occaecat',
      category: 'software design'
    },
    {
      _id: '6554id',
      owner: 'Barry',
      status: true,
      body: 'Adipisicing ea eu adipisicing esse ullamco',
      category: 'software design'
    },
    {
      _id: '32232id',
      owner: 'Jesse',
      status: false,
      body: 'commodo consequat est deserunt',
      category: 'groceries'
    }
  ];


  let todoService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    // Assert that the users we get from this call to getUsers()
    // should be our set of test users. Because we're subscribing
    // to the result of getUsers(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todoService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoService.todoUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with filter parameter \'owner\'', () => {

    todoService.getTodos({ owner: 'Barry' }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('owner')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('owner')).toEqual('Barry');

    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with filter parameter \'status\'', () => {

    todoService.getTodos({ status: true }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('status')).toEqual('true');

    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with filter parameter \'category\'', () => {

    todoService.getTodos({ category: 'groceries' }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('category')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('category')).toEqual('groceries');

    req.flush(testTodos);
  });

  it('getTodos() calls api/todos with filter parameter \'body\'', () => {

    todoService.getTodos({ body: 'Adipisicing ea eu adipisicing esse ullamco' }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('body')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('body')).toEqual('Adipisicing ea eu adipisicing esse ullamco');

    req.flush(testTodos);
  });


  it('getTodos() calls api/todos with multiple filter parameters', () => {

    todoService.getTodos({ owner: 'Barry', status: true, body: 'Adipisicing ea eu adipisicing esse ullamco',
    category: 'software design' }).subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(todoService.todoUrl)
        && request.params.has('owner') && request.params.has('status') && request.params.has('body')
        && request.params.has('category')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameters are correct
    expect(req.request.params.get('owner')).toEqual('Barry');
    expect(req.request.params.get('status')).toEqual('true');
    expect(req.request.params.get('body')).toEqual('Adipisicing ea eu adipisicing esse ullamco');
    expect(req.request.params.get('category')).toEqual('software design');

    req.flush(testTodos);
  });

  it('getUserById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo._id;
    todoService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoService.todoUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('filterTodos() filters by owner', () => {
    expect(testTodos.length).toBe(3);
    const todoOwner = 'Barry';
    expect(todoService.filterTodos(testTodos, { owner: todoOwner }).length).toBe(2);
  });

  it('filterTodos() filters by status', () => {
    expect(testTodos.length).toBe(3);
    const todoStatus = true;
    expect(todoService.filterTodos(testTodos, { status: todoStatus }).length).toBe(2);
  });

  it('filterTodos() filters by owner and status', () => {
    expect(testTodos.length).toBe(3);
    const todoOwner = 'Barry';
    const todoStatus = true;
    expect(todoService.filterTodos(testTodos, { owner: todoOwner, status: todoStatus }).length).toBe(2);
  });

  it('addTodo() posts to api/todos', () => {

    todoService.addTodo(testTodos[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(todoService.todoUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testTodos[1]);

    req.flush({id: 'testid'});
  });
});
