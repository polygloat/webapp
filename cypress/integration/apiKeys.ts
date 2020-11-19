/// <reference types="cypress" />
import {createRepository, deleteRepository, getPopover, host, login} from "../fixtures/shared";
import {getAnyContainingText, getClosestContainingText} from "../fixtures/xPath";
import {clickAdd} from "../fixtures/global";

describe('Api keys', () => {
    beforeEach(() => {
        cy.visit(host + '/apiKeys');
        login();
        createRepository("Test");
    });

    afterEach(() => {
        deleteRepository("Test", true);
    })

    it('Will add an api key', () => {
        cy.visit(host + '/apiKeys');
        create("Test");
        create("Test");
        create("Test");
        del();
        del();
        del();
    });
});


const create = async (repository: string) => {
    clickAdd();
    cy.contains("Generate api key").xpath(getClosestContainingText("Application")).click();
    getPopover().contains(repository).click();
    cy.xpath(getAnyContainingText("generate", "button")).click();
};

const del = () => {
    cy.wait(500);
    cy.xpath(getAnyContainingText("Api Key:"))
        .last()
        .xpath("(./ancestor::*//*[@aria-label='delete'])[1]")
        .scrollIntoView({offset: {top: -500, left: 0}}).click();
    cy.xpath(getAnyContainingText("confirm")).click();
};