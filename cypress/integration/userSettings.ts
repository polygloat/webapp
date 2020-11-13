/// <reference types="cypress" />
import {host, login} from "../fixtures/shared";
import {getAnyContainingText} from "../fixtures/xPath";

require('cypress-xpath');

describe('Login', () => {
    beforeEach(() => {
        cy.visit(host);
        login();
    });

    it('Will access api keys', () => {
        cy.xpath("//*[@aria-controls='user-menu']").click();
        cy.xpath(getAnyContainingText("Api keys")).click();
    });
});
