import {getAnyContainingAriaLabelAttribute} from "./xPath";

export const clickAdd = () => {
    cy.wait(500);
    cy.xpath(getAnyContainingAriaLabelAttribute("add")).click();
};