import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from './todo';
import { map } from 'rxjs/operators';

@Injectable()
export class TodoService {
  readonly todoUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) {
  }

  getTodos(filters?: { status?: boolean; owner?: string; body?: string; category?: string; limit?: number}): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status.toString());
      }
      if (filters.owner) {
        httpParams = httpParams.set('owner', filters.owner);
      }
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
      if (filters.body) {
        httpParams = httpParams.set('body', filters.body);
      }
      if (filters.limit) {
        httpParams = httpParams.set('limit', filters.limit.toString());
      }
    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }


  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }



  filterTodos(todo: Todo[], filters: { status?: boolean; owner?: string; body?: string; category?: string; limit?: number}): Todo[] {

    let filteredTodos = todo;
    const to = [];
    // Filter by status
    if (filters.status) {
      filteredTodos = filteredTodos.filter(todos =>
        todos.status.toString().toLowerCase().indexOf(filters.status.toString().toLowerCase()) !== -1);
    }

    // Filter by owner
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();
      filteredTodos = filteredTodos.filter(todos => todos.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }

     // Filter by category
     if (filters.category) {
      filters.category = filters.category.toLowerCase();
      filteredTodos = filteredTodos.filter(todos => todos.category.toLowerCase().indexOf(filters.category) !== -1);
    }

     // Filter by body
     if (filters.body) {
      filters.body = filters.body.toLowerCase();
      filteredTodos = filteredTodos.filter(todos => todos.body.toLowerCase().indexOf(filters.body) !== -1);
    }

    // Filter by limit
     if(filters.limit){
      let i = 0;
      while(i < filters.limit) {
        const random = Math.floor(Math.random() * filteredTodos.length);
        to.push(filteredTodos[random]);
        i++;
      }
      filteredTodos = to;
    }

    return filteredTodos;
  }
  addTodo(newTodo: Todo): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(res => res.id));
  }
}

