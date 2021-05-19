# Team 10 Coordination Meeting
### Date: Saturday, May 15
### Meeting Start Time: 4:00pm PST
### Location: Zoom
### Present: Asya, Akar, Akhil, Huy, Nathan, Praneet
### Absent: Brian, Ivan, Ryan
## Discussion Points
- decided to switch from local storage to indexedDB
  - not enough space in local storage (only about 5MB)
    - so we might not be able to store images and other larger things in local storage
  - planned out the structure of objects being stored in the database
  - object structure and corresponding design notes are in the sample json files in the repo
    - main structure
      - we will have three objectstores in the database (daily, monthly, yearly)
      - daily objectstore will store an object for each daily log that includes widgets, trackers, notes, etc for that day
      - monthly objectstore will store an object for each month that only includes notes (graphs for trackers and things can be calculated from the daily objects)
      - yearly objectstore will store an object for each year that includes notes and goals
## Meeting End Time: 6:45pm PST