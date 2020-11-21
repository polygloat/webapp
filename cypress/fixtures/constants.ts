export const HOST = Cypress.env("host") || 'http://localhost:5000';
export const PASSWORD = Cypress.env("defaultPassword") || "admin";
export const USERNAME = Cypress.env("defaultUsername") || "admin";
export const API_URL = Cypress.env("apiUrl") || "http://localhost:8201/api/"
