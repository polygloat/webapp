/// <reference types="cypress" />
import {getAnyContainingText, getInput} from "./xPath";
import {clickAdd} from "./global";

export const host = Cypress.env("host") || 'http://localhost:5000';
export const defaultUsername = Cypress.env("defaultUsername") || "admin";
export const defaultPassword = Cypress.env("defaultPassword") || "admin";

export const login = (username = defaultUsername, password = defaultPassword) => {
    cy.xpath('//input[@name="username"]')
        .type(username).should('have.value', username);
    cy.xpath('//input[@name="password"]')
        .type(password).should('have.value', password);
    cy.xpath("//button//*[text() = 'Login']").click();
    cy.xpath(getAnyContainingText("Login")).should("not.be.visible");
    cy.xpath("//*[@aria-controls='user-menu']");
};

export const createRepository = (name = "Repository", languages = [{name: "English", abbreviation: "en"}]) => {
    cy.visit(host + "/repositories");
    cy.wait(500);
    clickAdd();
    cy.xpath(getInput("name")).type(name);
    cy.xpath(getInput("languages.0.name")).type(languages[0].name);
    cy.xpath(getInput("languages.0.abbreviation")).type(languages[0].abbreviation);
    cy.xpath(getAnyContainingText("SAVE")).click();
};

export const deleteRepository = (name = "Repository", force: boolean) => {
    cy.visit(host + "/repositories");
    cy.wait(1000)
    cy.contains("Repositories").should("be.visible");
    cy.xpath(getAnyContainingText(name)).click({force});
    cy.wait(500);
    cy.xpath(getAnyContainingText("Repository settings")).click({force});
    cy.xpath(getAnyContainingText("Delete repository")).click({force});
    const chainableLabel = cy.xpath(getAnyContainingText("Rewrite text:"));
    chainableLabel.then($label => {
        chainableLabel.xpath("./ancestor::*[1]//input").type($label.get(0).textContent.replace(/.*"(.*)".*/g, "$1"), {force});
    });
    cy.xpath(getAnyContainingText("CONFIRM")).click({force});
};