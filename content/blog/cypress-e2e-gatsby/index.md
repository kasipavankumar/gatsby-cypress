---
title: "Everything You Need to Know About End-to-End Testing Gatsby Apps with Cypress"

date: "2020-11-14"

description: "Testing is an integral part of web development which allows you to add new features or fix bugs without worrying on what could break. Learn how to implement end-to-end integration testing for your Gatsby apps and automate testing with Github Actions."

front-image: "./assets/cover.jpg"

status: "draft"

type: "blog-post"

tags:
  [
    "cypress",
    "gatsby",
    "test-driven-development",
    "end-to-end-testing",
    "javascript",
  ]

redirects: ["/gatsby-cypress/"]
---

### Table of Contents

1. [What is E2E Testing?]()
2. [Introduction to Cypress]()
3. [Bootstrapping a Gatsby Application]()
4. [Setting Up the Test Environment]()
5. [Writing Our First Test]()
6. [Tests for Blog Post]()

### What is E2E Testing?

E2E or End-to-End testing involves testing an application from an end user's perspective. Objectives of this testing mechanism is to verify component and data integrity. E2E also allows developers to test the data flow in the UI similar to what an end user will experience. It also involves testing an application on various devices to ensure that it looks good and checks all the boxes of responsiveness.

### Introduction to Cypress

Cypress is a testing library for the web and writing end-to-end tests couldn't be much simpler. It is developed with modular architecture in mind, which allows for it’s functionality to be extended using plugins or by [hooks](https://en.wikipedia.org/wiki/Hooking). Cypress allows running cross browser tests which are very essential and ensure that our web application looks and functions the same in most of the browsers, I said most of the browsers because [Cypress only supports Chromium based browsers & Firefox](https://www.cypress.io/features/#:~:text=Supported%20Browsers). Also, when running Cypress in CI (headless) mode, it generates videos of the specified tests and screenshots of the failing tests which can be used to identify what is causing them to fail.

<div style="padding: 56.25% 0 0 0; position: relative">
  <iframe
    src="https://player.vimeo.com/video/237527670?color=ffffff"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
    frameborder="0"
    allow="autoplay; fullscreen"
    allowfullscreen
  ></iframe>
</div>

### Bootstrapping a Gatsby Application

Getting started with Gatsby is fairly simple, you can either start with a [provided starters](https://www.gatsbyjs.com/starters/) or bootstrap an application from scratch. We are going to use [Gatsby Starter Blog](https://github.com/gatsbyjs/gatsby-starter-blog) in this guide.

```bash
git clone https://github.com/gatsbyjs/gatsby-starter-blog.git
```

### Setting Up the Test Environment

As we have the app ready, the next step is to install Cypress as a devDependency. We will also need an additional package start-server-and-test which, as the name implies, will start the application server and run the specified test command. This is required for running tests on a CI server like Github Actions, Travis CI or the CircleCI. We will be setting up Github Actions later in this guide.

```bash
yarn add cypress start-server-and-test --dev
```

The following scripts are to be added in the `package.json`:

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "test:e2e": "start-test develop 8000 cy:open",
    "test:e2e:ci": "start-test develop 8000 cy:run"
  }
}
```

Let’s understand each of these scripts.

- cy:open - used to run tests in a browser. Cypress provides an interface from where tests can be executed in an automated browser environment.
- cy:run - used to run tests in a CI environment. Tests will run in the terminal without opening any kind of browser.
- test:e2e - Cypress does not start the development server by itself, the package `start-server-and-test` will do that for us. Running this command will first start the development server, execute `cy:open` which will run the tests. This script has 4 parts - start-test being the package itself, develop is the script which starts the development server, 8000 is the port on which Gatsby starts the development server, cy:open is the script to run tests.
- test:e2e:ci - Similar to the above script but for CI environments.

<aside class="alert-info">

The `start-test` part in `test:e2e` is an alias. [Read the documentation for more options](https://github.com/bahmutov/start-server-and-test#readme).

</aside>

Before proceeding, we need to allow Cypress to create few directories where we can start writing tests. In the terminal, execute `yarn cy:open` which should open the Cypress application and prompt you to confirm whether you want to create directories or not. Doing so will create a bunch of example test files which you can safely delete.

After deleting the generated test files, application directory structure should be similar to the figure shown below.

In the `cypress.json` file, we need to add `baseUrl` for Cypress to load the website.

```json
{
  "baseUrl": "http://localhost:8000"
}
```

<aside class="alert-note">

As mentioned in the introduction, Cypress will generate videos of all tests & screenshots of the failing tests, so you should consider adding `cypress/videos` & `cypress/screenshots` to the .gitignore file.

```gitignore
cypress/videos/*
cypress/screenshots/*
```

</aside>

### Writing Our First Test

The gatsby-starter-blog we cloned looks as shown above. We will keep the looks as they are and start testing. The title ‘Gatsby Starter Blog’ looks quite bold and grabs the attention, so why not write our test and assert that it does exist on the homepage.

Create a file in `cypress/integration` named `homepage.test.js` with the following code.

```js
// For VSCode Intellisense (autocomplete suggestions).
// https://docs.cypress.io/guides/tooling/intelligent-code-completion.html#Triple-slash-directives
/// <reference types="Cypress" />

describe("Homepage", () => {
  // Visit homepage before running any tests.
  before(() => {
    cy.visit("/")
  })

  it("should contain title with text `Caffeinated Thoughts`", function () {
    // Asserting the existence of title with text
    // `Caffeinated Thoughts`
    cy.contains("h1", "Caffeinated Thoughts")
  })
})
```

Voila! We have written our very first test. Let’s break it down to understand what is going on here.

The syntax is very similar to that used in some famous testing libraries like Jest, Mocha & Chai.

- The `describe` block is used to group similar kinds of tests and is called a test suite. It also has an alias `context`, which can be used interchangeably, but we’ll stick with `describe` as it conveys more semantic.

- `before()` is a function (hook to be specific) which is executed once before all tests. In Jest, the `beforeAll()` is an equivalent hook.

- `it()` is where you define the actual test. This is similar to the `test()` from Jest. When paired with `describe()`, it conveys better semantics.

Now, the test will read like - Before running any tests, visit homepage (`/`) then look for a title (h1) with text `Caffeinated Thoughts`.

**`cy.visit("/");` is important here, without which our test would fail as Cypress doesn’t know where to start.**

In the terminal, execute `yarn cy:run` and watch our very first test pass.

Further, let’s add a few more tests to test the presence of Bio along with its components like avatar, the phrase & link to Twitter profile.

```js
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
```

Since Bio is a part of homepage, we have nested it inside the homepage test suite and grouped similar tests inside a `describe()` block.

### Tests for Blog Post

Next thing to test are the blog posts. There are multiple posts and will increase as you add more posts. Although [you can dynamically generate tests](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Dynamically-Generate-Tests) for all the posts, it is not required. Testing any one of the posts should be enough.

#### Header

Every post should have a header with a link to the homepage.

HTML structure of header looks like:

```html
<header class="global-header">
  <a href="/" class="header-link-home">Caffeinated Thoughts</a>
</header>
```

```js
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
```
