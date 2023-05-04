/// <reference types="Cypress" />
describe("Central de Atendimento ao Cliente TAT", () => {
  const SECONDS_IN_MS = 3000;
  beforeEach(() => {
    cy.visit("./src/index.html");
  });
  it("verifica o título da aplicação", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });
  it("preencher os campos obrigatorios e envia o formulario", () => {
    cy.clock();
    cy.get("#firstName").type("Christopher", { delay: 0 });
    cy.get("#lastName").type("Santos", { delay: 0 });
    cy.get("#email").type("meuemail@gmail.com", { delay: 0 });
    cy.get("#open-text-area").type("Estou apenas testando", { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
    cy.tick(SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });
  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();
    cy.get("#email").type("meuemailgmail.com", { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });
  it("validar campo telefone", () => {
    cy.get("#phone").type("meucelular", { delay: 0 }).should("have.value", "");
  });
  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();
    cy.get("#firstName").type("Christopher", { delay: 0 });
    cy.get("#lastName").type("Santos", { delay: 0 });
    cy.get("#email").type("meuemail@gmail.com", { delay: 0 });
    cy.get("#open-text-area").type("Estou apenas testando", { delay: 0 });
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });
  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Christopher", { delay: 0 })
      .should("have.value", "Christopher")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Santos", { delay: 0 })
      .should("have.value", "Santos")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("meuemail@gmail.com", { delay: 0 })
      .should("have.value", "meuemail@gmail.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("998257902", { delay: 0 })
      .should("have.value", "998257902")
      .clear()
      .should("have.value", "");
  });
  it("exibe a mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.clock();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });
  it("envia o formulário com sucesso usando um comando customizado", () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
    cy.tick(SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");
  });
  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("select#product").select("YouTube").should("have.value", "youtube");
  });
  it("seleciona um produto (Mentoria) por seu value", () => {
    cy.get("select#product")
      .select("mentoria")
      .should("have.value", "mentoria");
  });
  it("seleciona um produto (Blog) por seu indice", () => {
    cy.get("select#product").select(1).should("have.value", "blog");
  });
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get("input[type='radio'][value='feedback']")
      .check()
      .should("have.value", "feedback");
  });
  it("marca cada tipo de atendimento", () => {
    cy.get("input[type='radio']")
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });
  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last('input[type="checkbox"]')
      .uncheck()
      .should("not.be.checked");
  });
  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get("input[type='file']")
      .selectFile("./cypress/fixtures/example.json")
      .then((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });
  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get("input[type='file']")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .then(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });
  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json", { encoding: null }).as("exampleFile");
    cy.get("input[type='file']")
      .selectFile("@exampleFile")
      .then((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });
  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get('a[href="privacy.html"]').should("have.attr", "target", "_blank");
  });
  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get('a[href="privacy.html"]').invoke("removeAttr", "target").click();
    cy.contains("CAC TAT - Política de privacidade").should("be.visible");
  });
  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });
  it("preenche a area de texto usando o comando invoke", () => {
    const longText = Cypress._.repeat("0123456789", 20);
    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });
  it("faz uma requisição HTTP", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should((response) => {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });
  it("mostrar gato", () => {
    cy.get("#cat").invoke("show").should("be.visible");
  });
});
