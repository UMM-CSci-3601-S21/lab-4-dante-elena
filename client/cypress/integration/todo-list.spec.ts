import { TodosListPage } from '../support/todo-list.po';

const page = new TodosListPage();

describe('Todos list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodosTitle().should('have.text', 'Todos');
  });

  it('Should show 300 todos in list view', () => {
    page.changeView('list');
    page.getTodosListItems().should('have.length', 300);
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for todos 'Dawn'
    cy.get('[data-test=todosOwnerInput]').type('Dawn');

    // All of the todos cards should have the owner we are filtering by
    page.getTodosListItems().each(e => {
      cy.wrap(e).find('.todos-list-owner').should('have.text', 'Owner: Dawn');
    });
  });

  it('Should type something in the body filter and check that it returned correct elements', () => {

    cy.get('[data-test=todosBodyInput]')
    .type('Id dolor culpa quis dolore elit sunt dolore. Amet adipisicing duis aliquip deserunt ut fugiat dolore.');

    // All of the todos cards should have the body we are filtering by
    // (We check this two ways to show multiple ways to check this)
    page.getTodosListItems().find('.todos-list-body').each($el =>
      expect($el.text()).to
      .contain('Body: Id dolor culpa quis dolore elit sunt dolore. Amet adipisicing duis aliquip deserunt ut fugiat dolore.')
    );
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {

    cy.get('[data-test=todosCategoryInput]')
    .type('groceries');

    // All of the todos cards should have the body we are filtering by
    // (We check this two ways to show multiple ways to check this)
    page.getTodosListItems().find('.todos-list-category').each($el =>
      expect($el.text()).to
      .contain('Category: groceries')
    );
  });

  it('Should type something in the status filter and check that it returned correct elements', () => {

    cy.get('[data-test=todosStatusInput]')
    .type('true');

    // All of the todos cards should have the body we are filtering by
    // (We check this two ways to show multiple ways to check this)
    page.getTodosListItems().find('.todos-list-status').each($el =>
      expect($el.text()).to
      .contain('Status: true')
    );
  });



});
