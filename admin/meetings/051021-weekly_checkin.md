# Team 10 Weekly Checkin
### Date: Monday, May 10
### Meeting Start Time: 1:00pm PST
### Location: Zoom
### Present: Sanat, Asya, Akhil, Praneet, Ryan
### Absent: Akar, Brian, Huy, Ivan, Nathan
## Discussion Points
- we gave updates for the past week
  - subteams have been formed (2 frontend, 2 backend)
    - all teams are currently working on HTML skeletons for the various logs
  - an initial CI/CD pipeline has been created
    - primarily focused on automated issue tracking and pull requests/merging
    - tried to implement a linter
  - we have a form for planning poker to assign values to each of the user stories
- feedback from Sanat
  - subteam divisions are good
  - planning poker is good
  - populate project board with backlog
    - gives everyone a central place to see what's going on with the project and what needs to be worked on
    - create and assign issues
  - storing things locally vs having a database
    - this is an important decision that we should make soon
    - which one we choose depends on what features we want our app to have
      - primarily: do we want to have user authentication?
        - database would be logical to use in this case
      - also database would allow user to use the application from multiple devices
        - data would persist on a central server rather than client side
  - make the repo public so that we can create a wiki
  - for the CI/CD pipeline
    - work on getting the linter functional
      - commit some sample JS code and run the linter on it to test it
    - add in a code quality tool (CodeFactor)
    - add documentation (JSDocs)
      - just generate documentation using JSDocs and add a link to it in the README
    - next phase of the pipeline should have functional linter, testing and documentation tools (Jest, Cypress, JSDocs)
    - make this a priority because pipeline will be important as we go forward
- what to work on this week
  - frontend teams should have wireframes translated into HTML
  - also have teams working on JavaScript functionality
  - decide whether or not we are going to have a database
    - if we are going to have a database, map out the schema for it
  - MVP (minimum viable product) should be done by next week
    - frontend should structurally resemble wireframes
    - basic functionality should be there
## Meeting End Time: 1:55pm PST