describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });


  it("should navigate to Tuesday", () => {
    cy.visit("/");

    // cy.get('li').contains('Tuesday').click()
    //cy.contains('li', 'Tuesday').click()
    //.should('have.css', 'background-color', 'rgb(242, 242, 242)');

    //Refactor the test to use a single command chain that finds the list item, clicks 
    //it and checks it for the correct background colour
    // cy.contains("li", "Tuesday")
    //   .click()
    //   .should("have.css", "background-color", "rgb(242, 242, 242)");

      //Refactoring using unique selector for testing only (data-testid="day")
      cy.contains('[data-testid="day"]', 'Tuesday')
      .click()
      .should("have.class", "day-list__item--selected");
  });


});