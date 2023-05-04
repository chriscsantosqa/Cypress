Cypress.Commands.add("fillMandatoryFieldsAndSubmit", () => {
  cy.get("#firstName").type("Christopher", { delay: 0 });
  cy.get("#lastName").type("Santos", { delay: 0 });
  cy.get("#email").type("meuemail@gmail.com", { delay: 0 });
  cy.get("#open-text-area").type("Estou apenas testando", { delay: 0 });
  cy.contains("button", "Enviar").click();
});
