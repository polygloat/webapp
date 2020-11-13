/// <reference types="cypress" />
import {host, login} from "../fixtures/shared";

require('cypress-xpath');

context('Login', () => {
    beforeEach(() => {
        cy.visit(host);
    });

    it('Will login', () => {
        login();
    });
});
