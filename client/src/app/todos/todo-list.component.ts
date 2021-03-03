import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit,OnDestroy {
  @Input() simple ? = false;
  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];


  public todoStatus: boolean;
  public todoOwner: string;
  public todoBody: string;
  public todoCategory: string;
  public todoLimit: number;
  public viewType: 'list' | 'card' = 'list';
  getTodoSub: Subscription;


  constructor(private todoService: TodoService) {

  }

  getTodosFromServer(): void {
    this.unsub();
    this.getTodoSub = this.todoService.getTodos({
      status: this.todoStatus,
      owner: this.todoOwner,
      body: this.todoBody,
      category: this.todoCategory,
      limit: this.todoLimit
    }).subscribe(returnedTodos => {
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, {
        status: this.todoStatus,
        owner: this.todoOwner,
        body: this.todoBody,
        category: this.todoCategory,
        limit: this.todoLimit});
  }

  /**
   * Starts an asynchronous operation to update the users list
   *
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getTodoSub) {
      this.getTodoSub.unsubscribe();
    }
  }
}


