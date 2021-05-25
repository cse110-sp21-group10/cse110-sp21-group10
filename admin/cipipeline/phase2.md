# CI/CD Pipeline Phase 2 Status

## Implemented in Phase 2

* Added JSDocs
  * The creation of functions triggers an automated generation of JSDocs documentation.
* Testing
  * We have implemented Jest and Jest-Puppeteer for unit testing and End-to-End Testing. We have written a number of test to test SPA navigation, but will continue to write more tests using Jest to get increasingly more code coverage.
* Updates to the Linter
  * We added some custom configuration to the linter on our repo.
  * We also have started to add Linting on everyone’s personal machine so small things like spacing and missing semicolons can be auto-corrected locally (no more linter battles in the repo pertaining to easily fixed mistakes).
  * We also changed when the Linter is run so that it doesn’t run twice
    * Changed it to run on pull-requests on the main branch and any pushes to main, rather than on pushes (besides main) and pull-requests

## Not Implemented

Our plan is to continue to write more unit tests to reach higher code coverage as measured by jest --coverage. Our goal is to eventually all score well using the Lighthouse tests.