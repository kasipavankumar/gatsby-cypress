// For VSCode Intellisense (autocomplete suggestions).
// https://docs.cypress.io/guides/tooling/intelligent-code-completion.html#Triple-slash-directives
/// <reference types="Cypress" />

describe("Homepage", () => {
  // Visit homepage before running any tests.
  before(() => {
    cy.visit("/")
  })

  it("should contain title with text `Caffeinated Thoughts`.", function () {
    // Asserting the existence of title with text
    // `Caffeinated Thoughts`
    cy.contains("h1", "Caffeinated Thoughts")
  })

  describe("Bio", () => {
    it("should have avatar.", function () {
      cy.get(".bio-avatar").should("exist")
    })

    it("should contain expected sentence.", function () {
      cy.contains(
        "p",
        /Written by D. Kasi Pavan Kumar who is building web applications and star gazing./i
      )
    })

    it("should contain a link to twitter profile.", function () {
      // Assert there exists a link to Twitter profile.
      cy.get("a[href='https://twitter.com/dkpk_']").should("exist")
      // Invalid link should not exist.
      cy.get("a[href='https://twitter.com/dkpk']").should("not.exist")
    })
  })
})
