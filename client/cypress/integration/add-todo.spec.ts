import { Todo } from 'src/app/todos/todo';
import { AddTodoPage } from '../support/add-todo.po';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add todo button', () => {
    // ADD TODO button should be disabled until all the necessary fields
    // are filled.
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('DANTE');
    page.addTodoButton().should('be.disabled');
    page.getFormField('status').type('true');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').type('GOOGLE');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').clear().type('from the center of the earth');
    // all the required fields have valid input, then it should be enabled
    page.addTodoButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {
    cy.get('[data-test=ownerError]').should('not.exist');
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');



    cy.get('[data-test=categoryError]').should('not.exist');
    page.getFormField('category').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');


    cy.get('[data-test=statusError]').should('not.exist');
    page.getFormField('status').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    page.getFormField('status').clear().type('reasonable');
    cy.get('[data-test=statusError]').should('not.exist');

    cy.get('[data-test=bodyError]').should('not.exist');
    page.getFormField('body').click().blur();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');

 });



 describe('Adding a new todo', () => {

  beforeEach(() => {
    cy.task('seed:database');
  });

  it('Should go to the right page, and have the right info', () => {
    const todo: Todo = {
      _id: null,
      owner: 'Test',
      status: true,
      category: 'Company',
      body: 'test example com',
    };

    page.addTodo(todo);

    // New URL should end in the 24 hex character Mongo ID of the newly added todo
    cy.url()
      .should('match', /\/todos\/[0-9a-fA-F]{24}$/)
      .should('not.match', /\/todos\/new$/);

    // The new todo should have all the same attributes as we entered
    cy.get('.todo-card-owner').should('have.text', todo.owner);
    cy.get('.todo-card-status').should('have.text', todo.status.toString());
    cy.get('.todo-card-body').should('have.text', todo.body);
    cy.get('.todo-card-category').should('have.text', todo.category);

    // We should see the confirmation message at the bottom of the screen
    cy.get('.mat-simple-snackbar').should('contain', `Added Todo Test`);
  });


});
});
