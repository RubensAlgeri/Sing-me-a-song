
/// <reference types="cypress" />

import { faker } from "@faker-js/faker";


const URL = "http://localhost:3000";

describe('Create Recommendation Test Suite ', () => {

    const recommendation = {
        name: faker.random.words(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`,
    };

    beforeEach(() => {
        cy.resetRecommendation();
        cy.createRecommendation(recommendation);
    });

    it("should increase score on click", () => {
        cy.visit(`${URL}/`);

        cy.get('#upvote').click();

        cy.get('#score').should('contain', `1`);
    });

    it("should decrease score on click", () => {
        cy.visit(`${URL}/`);

        cy.get('#downvote').click();

        cy.get('#score').should('contain', `-1`);
    });

    it("should decrease score to -5 and disappear", () => {
        cy.visit(`${URL}/`);

        for (let i = 0; i < 6; i++) {
            cy.get('#downvote').click();
        };

        cy.get('#player').should('not.exist');
    });
});