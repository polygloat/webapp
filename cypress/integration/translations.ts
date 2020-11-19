/// <reference types="cypress" />
import {clickAdd, createRepository, deleteRepository, getPopover, host, login} from "../fixtures/shared";
import {getAnyContainingAriaLabelAttribute, getAnyContainingText, getClosestContainingText} from "../fixtures/xPath";

function createTranslation(testSource: string, testTranslated: string, options: { isFirst?: boolean, nextPage?: boolean }) {
    if (options?.isFirst) {
        clickAdd();
    } else {
        cy.xpath(getAnyContainingText("Add", "span")).click()
    }
    cy.xpath("//textarea[@name='source']").type(testSource);
    cy.xpath("//textarea[@name='translations.en']").type(testTranslated);
    cy.xpath(getAnyContainingText("save")).click();
    if(options.nextPage){
        cy.xpath(getAnyContainingAriaLabelAttribute("Next page")).click()
    }
    cy.xpath(getAnyContainingText("Source text")).xpath(getClosestContainingText(testSource)).scrollIntoView().should("be.visible");
    cy.xpath(getAnyContainingText("Source text")).xpath(getClosestContainingText(testTranslated)).should("be.visible")
}

describe('Translations', () => {
    before(() => {
        login();
        createRepository("Test");
        cy.contains("Test").click();
        cy.contains("Translations").click();
    });

    after(() => {
        deleteRepository("Test", true);
    })

    it('will create translations', () => {
        createTranslation("Test source", "Translated test source", {isFirst: true});

        cy.xpath(getAnyContainingText("Rows per page:")).xpath(getClosestContainingText("20")).click();
        getPopover().xpath(getClosestContainingText("10")).click()

        for (let i = 0; i < 21; i++) {
            const nextPage = (i + 1) % 10 === 0;
            createTranslation(`Test source ${i.toString().padStart(2, "0")}`, `Translated test source ${i}`, {nextPage});
        }
    });
});
