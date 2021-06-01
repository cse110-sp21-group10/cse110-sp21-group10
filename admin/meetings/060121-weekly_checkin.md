# Team 10 Weekly Checkin
### Date: Tuesday, June 1
### Meeting Start Time: 1:00pm PST
### Location: Zoom
### Present: Sanat, Asya, Akar, Akhil, Nathan, Praneet, Ryan
### Absent: Brian, Huy, Ivan
## Discussion Points
- updates from the past week
  - we added nested bullets and individual bullet deletion
  - created sidebar popout to allow for font changes
    - the sidebar will also allow for theme changes
  - put in a weather widget
    - the widget currently appears on all days, so this needs to be fixed so that it only shows up on the current day
  - added new section functionality
  - worked on trackers
    - trackers have been added to the daily log
    - charts being created in the monthly log
  - put in the dropdown for different bullet types
    - need to implement the functionality of selecting one of the different bullets
  - working on implementing labels for bullets
- feedback from Sanat
  - we are on track to do well!
    - we have all the core features need for our project
    - just have to tie things together and focus on testing
  - consider adding a page showing how to use the journal
    - help icon can be added to the bottom right of the sidebar
  - testing
    - don't worry about getting a specific number on the coverage report
      - coverage report doesn't include tests from puppeteer
      - it is tough to unit test functions that interact directly with the DOM
    - make sure that anything that isn't marked as covered in the coverage report is tested using puppeteer
      - smaller features like font changes don't necessarily have to be tested, but core features should be
    - add actions to the GitHub pipeline to run testing when code is pushed
  - deployment
    - we need to deploy our application
    - can use GitHub pages or Heroku for deployment
    - this needs to be done for the final product
  - final
    - 2 videos
      - one shorter video (less than 4.5 minutes) that includes a demo of our journal and short discussion of challenges we overcame or what we would have done different
        - this one will be shown in class
      - one longer video (less than 15 minutes) in which each team member describes their contributions, we go over our repo, and we give a detailed retrospective about our adherence to the Agile process
        - this one will only be seen by the TAs
  - reminder: we should stop coding and implementing new features by June 7, so we have time to focus on the final assignments
## Meeting End Time: 2:00pm PST
