# CI/CD Pipeline Phase 1 Status 

## Implemented

Our CI/CD pipeline automates **linting, issue and pull request processing, and code quality checking**. 
* The automation of the issue tracking and pull request process is the most central of the pipeline processes to our project development, so we implemented it first. 
* We implemented linting to catch errors in code as we begin to begin writing more JavaScript. This was done relatively late in the process, so it cannot be seen in the demo. The Linter checks all pull requests made and anything being pushed to the main branch for code style. We implemented the code styling check in the repo because we wanted our repo manager to have access to whatever feedback the Linter has before merging requests. As it was added later in this phase, we will be sure to check it more thoroughly in Phase 2.
* We have chosen to use CodeFactor for our code quality via the tool component of our pipeline, but as this was added fairly late in the phase, we are not entirely sure how it works entirely and how we will use it to its fullest potential. This will be something we refine and build on in phase 2.

## Not Implemented

Our CI/CD pipeline is yet to implement **documentation generation and automated unit testing**.
* We have not implemented documentation generation through things like JSDocs yet because since we have been working on HTML and CSS, we have not had any JavaScript code to generate documentation for. 
  * Since we are now going to write JavaScript, we will implement this JSDoc generation in Phase 2 of the pipeline development. 
* We have not implemented unit testing yet because it seems that the professor and labs will teach us a bit more on how to implement automated unit testing. 
  * As we learn this we will implement it in Phase 2 of our pipeline.

## Automation Aspects

* Progress tracking
  * Project board automation helps track progress through the following columns:
  * To-do
    * Represents: backlog of **issues** (AKA a broken down user story)
    * Automation: moves issues here **upon creation**
  * In progress
    * Represents: un-reviewed **pull requests** (AKA attempt to implement story)
    * Automation: moves pull requests here **upon creation**
  * Under review
    * Represents: **pull request** has been reviewed & decided needs changes
    * Automation: moves pull requests here **reviewer requests changes**
  * Approved
    * Represents: **pull requests** that have been reviewer approved by at least 1 team (but still waiting for a net 3 approvals before merging)
    * Automation: moves any pull requests here after the **first reviewer approval**
  * Done
    * Represents: **pull requests** that all 3 of the other teams (and thus the group as a whole) have approved
    * Automation: moves any pull request here after **3 approvals** and **attempts to automerge to main branch**
      * Note: groups should take care to always pull before committing and pushing to avoid merge conflicts since the bot might not handle those well

* Linter
  * The Linter will automatically check all new files that are created when a pull request is made, and when anything is pushed to any branch besides main
    * This gives us an external helper for maintaining standard style guidelines in all of our files, helping to prevent small errors that we missed in our reviews
      * Note: this code styling check is in addition to physical reviews by people and will not act as the only check
* CodeFactor
  * CodeFactor checks our code for code quality, meaning it ensures we do not make sloppy style mistakes, and if we do, it indicates that in the dashboard



