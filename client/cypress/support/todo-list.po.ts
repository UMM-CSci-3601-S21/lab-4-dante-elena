export class TodosListPage {
  navigateTo() {
    return cy.visit('/todos');
  }

  getUrl() {
    return cy.url();
  }

  getTodosTitle() {
    return cy.get('.todos-list-title');
  }

  getTodosCards() {
    return cy.get('.todos-cards-container app-todos-card');
  }

  getTodosListItems() {
    return cy.get('.todos-list-item');
  }

  /**
   * Clicks the "view tasks" button for the given Todos card.
   * Requires being in the "card" view.
   *
   * @param card The Todos card
   */
  clickViewInfo(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewInfoButton]').click();
  }

  /**
   * Change the view of Todos.
   *
   * @param viewType Which view type to change to: "card" or "list".
   */
  changeView(viewType: 'card' | 'list') {
    return cy.get(`[data-test=viewTypeRadio] .mat-radio-button[value="${viewType}"]`).click();
  }

  /**
   * Selects a role to filter in the "Status" selector.
   *
   * @param value The role *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectStatus(value: string) {
    return cy.get('[data-test=todosStatusInput]').click().get(`mat-option[value="${value}"]`).click();
  }

  selectOrder(value: string) {
    return cy.get('[data-test=todosOrderSelect]').click().get(`mat-option[value="${value}"]`).click();
  }
}
