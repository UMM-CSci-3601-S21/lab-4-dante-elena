import {Todo} from 'src/app/todos/todo';

export class AddTodoPage {
  navigateTo() {
    return cy.visit('/todos/new');
  }

  getTitle() {
    return cy.get('.add-todos-title');
  }

  addTodoButton() {
    return cy.get('[data-test=AddTodoButton]');
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }

  getFormField(fieldOwner: string) {
    return cy.get(`mat-form-field [formControlName=${fieldOwner}]`);
  }

  addTodo(newTodo: Todo) {
    this.getFormField('owner').type(newTodo.owner);
    this.getFormField('status').type(newTodo.status.toString());

    this.getFormField('category').type(newTodo.category);

    this.getFormField('body').type(newTodo.body);
    return this.addTodoButton().click();
  }
}
