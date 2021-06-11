# Team 10 Weekly Meeting
### Date: Wednesday, May 26
### Meeting Start Time: 2:00pm PST
### Location: Zoom
### Present: Asya, Akar, Akhil, Brian, Ivan, Nathan, Praneet, Ryan
### Absent: Huy
## Discussion Points
- testing
  - need to look into linter issues with the test files
  - linter apparently does not like Jest, so we need to work around that
- monthly and yearly logs
  - each log will have 2 sections (no button to add custom sections)
    - monthly log will have Monthly Notes and Monthly Goals
    - yearly log will have Yearly Notes and Yearly Goals
  - monthly calendar section will have buttons for each day of the month, and the id of each button will be the key of the corresponding daily object in storage (i.e. button for May 2 on the May monthly calendar will have an id "D 210502")
  - yearly calendar section will have buttons for each month of the year, and the id of each button will be the key of the corresponding monthly object in storage (i.e. button for May on the 2021 yearly calendar will have an id "M 2105")
- next steps
  - add functionality for individual deletion of notes by clicking on the delete button in the bullet object
    - this requires adding some functionality bullet element and daily log element
  - add functionality for individual labeling of notes
  - once we have individual deletion/labeling, we can look into a selection mode to select multiple bullets for mass deletion/labeling
  - start working on different types of bullets
  - create dark mode/high contrast mode themes
## Action Items
- what teams will be working on
  - Team 1: working on testing
  - Team 2: finishing up bullet styling, will work on different bullet types
  - Team 3: update the daily/monthly/yearly log objects, work with team 4 on deletion and nested bullet functionality
  - Team 4: finishing the nested bullets, will start looking into labeling
- general plan can be found [here](https://docs.google.com/document/d/169ywQN2vdEatRpalnOpNVe1vDuV_mut0OZu8WWZWqZA/edit?usp=sharing)
## Meeting End Time: 3:20pm PST
