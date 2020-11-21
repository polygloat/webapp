/// <reference types="cypress" />
import {HOST, login} from "../fixtures/shared";

require('cypress-xpath');

context('Login', () => {
    beforeEach(() => {
        cy.visit(host);
    });

    it('Will login', () => {
        login();
    });
});
