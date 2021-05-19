# Team 10 Weekly Meeting
### Date: Wednesday, May 12
### Meeting Start Time: 2:00pm PST
### Location: Zoom
### Present: Asya, Akar, Akhil, Huy, Ivan, Nathan, Praneet, Ryan
### Absent: Brian
## Discussion Points
- pipeline
  - we need to integrate testing into the pipeline for the next phase
  - unit testing integration using Jest
  - end-to-end testng using Cypress
- storage
  - Database class has been created to interact with the IndexedDB database
  - the following functions are defined in the class
    - for the database in general
      - open, deleteDatabase
    - for bullet objects
      - storeBullet, getBullet, deleteBullet
    - for daily objects
      - storeDay, getDay
    - for monthly objects
      - storeMonth, getMonth
    - for yearly objects
      - storeYear, getYear
    - for label objects
      - storeLabel, getLabel, deleteLabel
- bullet object
  - need the template for this object as soon as possible
  - should include constructing a bullet html element and functions to update the attributes of the bullet element
  - the bullet object will also contain a list of other bullet IDs that are the IDs of its children bullets (see the design notes)
## Action Items
- what teams will be working on
  - Team 1: integrating testing into the pipeline and styling
  - Team 2: creating the bullet template
  - Team 3: storage and construction of the daily object
  - Team 4: bullet functionality (creating/editing/deleting bullets)
## Meeting End Time: 3:05pm PST