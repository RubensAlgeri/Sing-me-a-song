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
    });

	it("should create a recommendation", () => {
		cy.visit(URL);

		cy.get('[placeholder*="Name"]').type(recommendation.name);
		cy.get('[placeholder*="https://youtu.be/..."]').type(recommendation.youtubeLink);
        cy.intercept("POST", "/recommendations").as("recommendation");
        cy.get('#createRecommendation').click();
        cy.wait('@recommendation');
    
        cy.contains(`${recommendation.name}`).should('exist');
	});


    it('should not create recommendation', () => {
        cy.visit(`${URL}/`);
        cy.get('[placeholder*="Name"]').type(recommendation.name);

        cy.intercept("POST", "/recommendations").as("recommendation");
        cy.get('#createRecommendation').click();
        cy.wait('@recommendation');

        cy.contains(`${recommendation.name}`).should('not.exist');
    });
});

describe('Navigate into all Menu Pages', () => {
    const recommendation = {
        name: faker.random.words(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`,
    };

    beforeEach(() => {
        cy.resetRecommendation();
        cy.createRecommendation(recommendation);
    });

    it('should navigate to top page', () => {
        cy.intercept('GET', '/recommendations').as('getHome');
        cy.visit(`${URL}/`);
        cy.wait('@getHome');

        cy.intercept('GET', '/recommendations/top/10').as('getTop');
        cy.contains('Top').click();
        cy.wait('@getTop');

        cy.get(`article`).should('have.length.greaterThan', 0);
        cy.get(`article`).should('have.length.lte', 10);

        cy.contains(`${recommendation.name}`).should('exist');

        cy.url().should('equal', `${URL}/top`);
    });

    it('should navigate to random page', () => {
        cy.intercept('GET', '/recommendations').as('getHome');
        cy.visit(`${URL}/`);
        cy.wait('@getHome');

        cy.intercept('GET', '/recommendations/random').as('getRandom');
        cy.contains('Random').click();
        cy.wait('@getRandom');

        cy.get(`article`).should('have.length', 1);

        cy.contains(`${recommendation.name}`).should('exist');
        cy.url().should('equal', `${URL}/random`);
    });

    it('should navigate to home page', () => {
        cy.intercept('GET', '/recommendations').as('getHome');
        cy.visit(`${URL}/`);
        cy.wait('@getHome');

        cy.contains('Home').click();

        cy.contains(`${recommendation.name}`).should('exist');
        cy.url().should('equal', `${URL}/`);
    });
});