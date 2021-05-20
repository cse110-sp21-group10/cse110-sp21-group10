# Team 10 Design Notes Meeting
### Date: Tuesday, May 18
### Meeting Start Time: 7:30pm PST
### Location: Zoom
### Present: Asya, Akar, Akhil, Brian, Huy, Nathan, Praneet, Ryan
### Absent: Ivan
## Discussion Points
- overall design notes can be found at `/admin/data models/DesNotes.md`
- images/audio
  - any uploaded images/audio should be copied into IndexedDB
  - images and audio will be stored with IDs and the bullets that the images/audio belong to will store those corresponding image/audio IDs
- bullets/sections
  - can be implemented using custom html elements
- migration automation
  - fully automated migration would take away from the review/retrospective aspect of bullet journaling
    - also maybe users just don't want to do a certain task that they noted down, so auto-migration might be unwanted for users
  - alternate approach: semi-automated migration
    - each day, there will be a section showing incomplete tasks from the previous day that weren't migrated, and users will have the option to complete those tasks or migrate them
- viewing past journal entries
  - group agrees that past journal entries should be read-only
  - how do we define when a day ends?
    - some users might not finish editing their day's notes by midnight, so we need a different cutoff
    - solution: if the user accesses their daily notes after midnight but before 3am, the app will ask the user if they are done editing the previous day
      - if they say they are done, that day locks and the next day becomes editable
      - if they say they aren't done, they can continue editing the previous day
        - the previous day will automatically lock after the user next leaves the app or after 0.5-1 hr of inactivity
- trackers
  - currently we decided to store tracker information in each daily object
  - another option is storing the total/averaged tracker information in each monthly object
    - this would require updating the monthly object each time the daily object is updated as well
  - at most we would have to loop through 31 daily objects, so it shouldn't take too long to collect tracker information from all the days in a month
    - so we decided to stick with the current plan of storing tracker information in each daily object
- things we need for MVP
  - bullet object
    - constructor, destructor, edit functions
    - template for bullets (custom html element)
  - daily object
    - constructor, update function for adding bullet IDs
  - storage
    - storing daily objects
    - storing bullet objects
## Meeting End Time: 8:50pm PST
