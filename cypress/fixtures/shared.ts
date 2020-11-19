/// <reference types="cypress" />
import {getAnyContainingAriaLabelAttribute, getAnyContainingText, getInput} from "./xPath";

export const host = Cypress.env("host") || 'http://localhost:5000';
export const defaultUsername = Cypress.env("defaultUsername") || "admin";
export const defaultPassword = Cypress.env("defaultPassword") || "admin";

export const login = (username = defaultUsername, password = defaultPassword) => {
    cy.visit(host + "/login");
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
    languages.forEach((language, index) => {
        cy.xpath(getInput(`languages.${index}.name`)).type(language.name);
        cy.xpath(getInput(`languages.${index}.abbreviation`)).type(language.abbreviation);
        if (index !== languages.length - 1) {

        }
    })
    cy.xpath(getAnyContainingText("SAVE")).click();
};

export const deleteRepository = (name = "Repository", force: boolean) => {
    cy.visit(host + "/repositories");
    cy.wait(1000)
    cy.contains("Repositories").should("be.visible");
    cy.xpath(getAnyContainingText(name)).click({force});
    cy.wait(100);
    cy.xpath(getAnyContainingText("Repository settings")).click({force});
    cy.xpath(getAnyContainingText("Delete repository")).click({force});
    const label = cy.xpath(getAnyContainingText("Rewrite text:")+"/ancestor::*[1]//input");
    label.type(name.toUpperCase(), {force});
    cy.xpath(getAnyContainingText("CONFIRM")).click({force});
};

export const clickAdd = () => {
    cy.wait(100);
    cy.xpath(getAnyContainingAriaLabelAttribute("add")).click();
};

export const getPopover = () => {
   return cy.xpath("//*[contains(@class, 'MuiPopover-root') and not(contains(@style, 'visibility'))]")
}