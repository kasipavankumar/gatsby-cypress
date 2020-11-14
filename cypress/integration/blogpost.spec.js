// For VSCode Intellisense (autocomplete suggestions).
// https://docs.cypress.io/guides/tooling/intelligent-code-completion.html#Triple-slash-directives
/// <reference types="Cypress" />

describe("Blog Post (Gatsby Cypress)", () => {
  // You have visit any of the blog posts.
  before(() => {
    cy.visit("/new-beginnings/")
  })

  // After all the tests, click on the header
  // and assert the redirection to homepage.
  after(() => {
    cy.get('a[class="header-link-home"]').click()
    // Cypress should now be on the homepage.
    cy.url().should("include", "/")
  })

  it("should have header.", function () {
    // Get header by class `global-header`.
    // Within header, there should be a link to home
    // with text `Caffeinated Thoughts`.
    cy.get('header[class="global-header"]').within($header => {
      cy.get('a[class="header-link-home"]').then($link => {
        expect($link).to.contain("Caffeinated Thoughts")
      })
    })
  })

  it("should have article.", function () {
    cy.get('article[class="blog-post"]').then($article => {
      expect($article).to.have.attr("itemscope")
      expect($article).to.have.attr("itemtype", "http://schema.org/Article")
    })
  })

  describe("Header", () => {
    it("should title with itemprop headline.", function () {
      cy.get('h1[itemprop="headline"]').should("exist")
    })

    it("should have article published date.", function () {
      cy.get(".published-date").should("exist")
    })
  })

  it("should have article body (content).", function () {
    cy.get('section[itemprop="articleBody"]').should("exist")
  })

  describe("Footer", () => {
    it("should exist.", function () {
      cy.get("footer").should("exist")
    })

    it("should have bio.", function () {
      cy.get(".bio").should("exist")
    })

    describe("Bio", () => {
      it("should have avatar.", function () {
        cy.get(".bio-avatar").should("exist")
      })

      it("should have expected phrase.", function () {
        cy.contains(
          "p",
          /Written by D. Kasi Pavan Kumar who is building web applications and star gazing./i
        )
      })

      it("should have link to Twitter profile.", function () {
        cy.get('a[href="https://twitter.com/dkpk_"]')
      })
    })
  })

  it("should have link to previous blog post.", function () {
    cy.get('a[rel="prev"]').should("exist")
  })
})
