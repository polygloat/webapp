/// <reference types="cypress" />
import {createRepository, deleteRepository, host, login} from "../fixtures/shared";
import {getAnyContainingText} from "../fixtures/xPath";
import {clickAdd} from "../fixtures/global";

describe('Api keys', () => {
    beforeEach(() => {
        cy.visit(host + '/apiKeys');
        login();
        createRepository();
    });

    afterEach(() => {
        deleteRepository("Repository");
    })

    it('Will add an api key', () => {
        cy.visit(host + '/apiKeys');
        create();
        cy.xpath(getAnyContainingText("Api Key:")).its("length").then(n => {
            create();
            cy.xpath(getAnyContainingText("Api Key:")).its("length").should('be.greaterThan', n);
            del();
        });
        del();
    })
});


const create = () => {
    clickAdd();
    cy.xpath(getAnyContainingText("generate", "button")).click();
};

const del = () => {
    cy.xpath(getAnyContainingText("Api Key:"))
        .last()
        .xpath("(./ancestor::*//*[@aria-label='delete'])[1]")
        .scrollIntoView({offset: {top: -500, left: 0}}).click();
    cy.xpath(getAnyContainingText("confirm")).click();
};