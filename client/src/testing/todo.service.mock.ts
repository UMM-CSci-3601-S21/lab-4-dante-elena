import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo  } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */


@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
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

  constructor() {
    super(null);
  }

  getTodos(): Observable<Todo[]> {
    // Just return the test todos regardless of what filters are passed in
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test todo,
    // return that user, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
