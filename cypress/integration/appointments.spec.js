describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset"); //reset database

    cy.visit("/"); //Visits the root of our web server

    cy.contains('Monday');

  })



  it("should book an interview", () => {

    cy.get('[alt=Add]')
      .first() //need to use first because there are two Add buttons
      .click() // click the add button for the empty appointment

    cy.get('[data-testid=student-name-input]')//find input and type the name
      .type('Lydia Miller-Jones');

    cy.get('[alt="Sylvia Palmer"]').click(); //select the interviewer with the name "Sylvia Palmer"

    cy.contains('Save').click(); //click save button

    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');//checking if contains 
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });



  it("should edit an interview", () => {

    cy.get('[alt=Edit]')
      .first() //need to use first because there are two edit and delete buttons
      .click({ force: true }) // click the add button for the empty appointment

    cy.get('[data-testid=student-name-input]')//find input and type the name
      .clear().type("Lydia Miller-Jones");

    cy.get('[alt="Tori Malcolm"]').click(); //select the interviewer with the name "Sylvia Palmer"

    cy.contains('Save').click(); //click save button

    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');//checking if contains 
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  });



  it("should cancel an interview", () => {

    // cy.get('[alt=Delete]')
    // .first() //need to use first because there are two edit and delete buttons
    // .click({ force: true }); // click the add button for the empty appointment

    // cy.contains('Are you sure you would like to delete?').should('be.visible');

    // cy.contains('Confirm').click(); //click confirm button

    // cy.get('.appointment__card--show').should('not.exist', 'Archie Cohen');
    cy.get("[alt=Delete]")
      .click({ force: true });

    cy.contains("Confirm").click();

    cy.contains("Deleting").should("exist"); // check that the "Deleting" indicator exists
    cy.contains("Deleting").should("not.exist"); //after deletinf check that the "Deleting" indicator not exist

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");



  });

});
