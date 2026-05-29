 
### Serve Robotics QA Automation Assessment

#### Overview

This repository contains automated test coverage for the Serve Robotics QA Assessment.

#### Tech stack
* Playwright
* TypeScript
* Node.js
* dotenv

The project includes:
* Web UI automation tests using SauceDemo
* API automation tests using The Movie Database (TMDB) API

⸻

#### Prerequisites

Before running the tests, make sure the following are installed:
* Node.js
* npm (included with Node.js)
* Visual Studio Code (optional)

Verify installation:
node -v
npm -v

⸻

#### Project Setup
1. Create a project folder
mkdir ~/Desktop/serve-robotics-assessment
1. Open the folder in VS Code
File → Open Folder → select serve-robotics-assessment
1. Open a terminal
Terminal → New Terminal
1. Initialize Playwright
npm init playwright@latest
Select the following options:
* Language: TypeScript
* Tests folder: tests
* GitHub Actions workflow: No
* Install Playwright browsers: Yes
1. Install project dependencies
npm install
1. Install Playwright browsers
npx playwright install

⸻

#### Environment Configuration
Create a .env file in the project root and add your TMDB API token:
TMDB_TOKEN=your_tmdb_token_here

⸻

#### Running Tests
Run all tests
npx playwright test
Run API tests only
npx playwright test tests/API/api-assessment.spec.ts
Run Web UI tests only
npx playwright test tests/WebUI/WebUI-automation-assessment.spec.ts
Run tests in Playwright UI Mode
npx playwright test --ui
Run one specific test only
npx playwright test/API-assessment.spec -g “TEST CASE NAME”        
⸻

#### Web UI Test Coverage
The Web UI assessment covers the following scenarios:
* Open homepage
* Login with valid credentials
* Sort products by price (Low to High)
* Add products to cart
* Verify cart count
* Complete checkout flow
* Remove products from cart

⸻

#### API Test Coverage
The API assessment covers the following scenarios:
* Get popular movies
* Search movie by title
* Invalid endpoint validation
* Invalid movie ID validation
* Unauthorized request validation
* Movie details by ID
* Search non-existing movie
* Verify movie genres list
* Verify adult flag exists
* Verify API response time

⸻

#### Notes
The project uses Playwright locators and APIRequestContext for automation. Environment-specific data such as API tokens is stored in a .env file and is not committed to source control.