# Design Notes

## Days.json
File contains data for all logged days so far.  
Each day is represented as a JSON object with the following:
- `ID`: just the YYMMDD Date of the Day
- `Widgets`: A section of the log that's always near the top
  - Type examples: reminder, weather, etc.
  - Content relies on type and will be developed / implemented by assignee
- `Trackers`: An example implementation of widget 
  - Type choices: `slider`, `checkbox`
  - Name: name of the tracker
  - Value: ranges from 0-10 for sliders, 0 or 1 for checkboxes
- `Sections`: Array of Sections, displayed below `Widgets`
  - Type choices: `log`, `checklist`
    - Determines the type of `bullet`s created (or at least their initial values)
  - Name: name of the section (`Notes` is required, `Shopping List` is an example)
  - bulletIDs: Array of bullet IDs under this section
    - Refer to `#Bullets.json` for details

## Months.json
File contains data for all logged months so far.  
Each month is represented as a JSON object with the following:
- `ID`: just the YYMM Date of the Month
- `Sections`: A single-object Array of sections
  - `Notes`: The name of the solitary section saved under months
  - `Type`: Log (indicates non-checkboxed bullets)
  - `BulletIDs`: Array of bullet IDs under this section
    - Refer to `#Bullets.json` for details

## Years.json
File contains data for all logged years so far.  
Each year is represented as a JSON object with the following:
- `ID`: just the YY representation of the year
- `Type`: one `log` and one `checklist`
- `Name`: one `Notes` and one `Goals`
- `bulletIDs`: Array of bullet IDs under their respective sections
  - Refer to [Bullets.json](#Bullets.json) for details
  
---

## Bullets.json
- Anywhere bullets would be, their IDs are stored instead.  
- All the bullets will be stored in a seperate DB of bullets (refer to bullets.json for an example)
  - We do this so that we can have each label contain [list of bullet ids]  
  - We'll use a fetch function to retrieve the bullet object whenever needed

Internal Variables of each bullet:
- `ID`: will be used to figure out which bullet you want to retrieve
    - Daily: B YYMMDD sn bn
    - Monthly : B YYMM sn bn
    - Yearly : B YY sn bn
        - sn - section number
        - bn - bullet number
            - values: 00 - 99
    - Examples: 
      - `B 210517 01 15` : the 16th bullet in the 2nd section of date 2021-05-17.  
      - `B 2105 03` : the 4th bullet in the Notes section (the only section) of month 2021-05 
      - `B 21 1 02` : the 3rd bullet in the Goals section (2nd section) of year 2021
- `labelIDs`: Array of label IDs applied to this bullet
    - Refer to [Labels.json](#Labels.json) for details
- `bulletIDs`: Array of bullet IDs that are subChildren of this bullet
    - When creating the HTML Element, also create children and link children to HTML Element
    - ^ This cuts out any need for a 'parentID' (extra work to lookup and retrieve)
- `text`: (string) the inner text of the bullet
- `value`: (int) determines the state of the checkbox
    - -1: Not a checkbox (don't display)
    - 0: Unfinished (⬛)
    - 1: Finished (✅)
        
Notes:
- Need global variables to represent options when creating (trackers, widgets, sections)  
- Need global mapping of (Array of Element)s to (label)s - enables toggling of labels
  - Clarification: Label.json has access to an array of bulletIDs, which allows for quickly toggling on/off certain labels (a feature we could implement later)
- MultiMedia:
  - Copy stored in DB separately (similar to labels) and listed by IDs
  - Need to look into storage capacity and imposing a filesize limit
- `updateData()` function for Bullet HTML Element
- static `sectionNumber` counter for each view (Daily, Monthly, Yearly)
- static `bulletNumber` counter for each Section HTML Element
---

## Labels.json
- Labels is the user-created labels
  - We might have our own default ones.

Style idea: 
- we have a labels section to the side, under the zoom out button in daily
- The user can click on the label they want, then click on bullets to apply that label to the bullets. 
  - we can change the cursor to a label icon with correct label color to indicate that's it's in `labeling mode`
    
Internal Variables:
- `ID`: Of the form: `L XXX` (String)
  - Example: 'L 003' --> 4th Label
- `color`: (string) example: "#ffa5d2",
- `name`: (string) user specified name for the label
- `desc`: (string) description set by user
- `bulletIDs` = [Array of all bulletIDs this label applies to]
  - used to display all bullets if user uses it to reflect (cuts out most of the heavy calculations)
    
---

## Global/saved variables

    widgets[]: list of widget names the user have picked in daily, used to create a new page

    sections[]: list of section names the user have picked in daily, used to create a new page

    other variables can be accessed in their sepective .json files, defined above ^

--- 

## Class Functions
Constructor(s) for each object type as a `custom HTML Element` 
- (bullet, label, dailyLog, monthlyLog, yearlyLog, widget, section).

DocElementConstructor(s) for each object type
- Input: takes in the Object
- Output: spits out an HTML element (using its own template) to display it, so that we can append this element to main html 

Daily:
- daily could have an `empty constructor()`, 
  - Uses wigets[] and sections[] to create a blank daily page object (a dictionary)
- daily could have a `filled constructor(dailyLog)`, 
  - Takes in the dailyLog object and creates a populated daily page object (a dictionary) 
  - (might not be needed if dailyLog is the same object)
- daily could have an `activate() function` 
  - Loads the daily Object into the daily page so the user can view it. 
  - If user moves to another page (future or past):
    1.  that page object should be grabed (or created if it's not there yet) 
    2.  call `activate()` to replace the current shown page.
- ^ Similar process for monthly and yearly.
- Also need on change listeners to update DB!
  - Relevant to bullet, section, widget, and tracker modifications

Monthly:
- In monthly constructor: 
  - it should retrieve the dailyObjs of the month
    - Retrieve (YYMM00-YYMM31) from the Days DataBase
  - Iterate through them to collect data and create elements that rely on that data:
    - Tracker data to make graphs
    - Highlight entries on the calendar based off tracker data
    - Set up the calendar buttons to direct you to the correct date )

Note:
- The `daily.activate()` function will need to create a custom DocElement of each element it finds in the dailyLog object (widgets, bullets, sections) 
  - means we need those elements to have their own DocElementConstructor() and templates, 
    - similarly to lab6 (or lab5?)

- The parent Object will call the childrens constructor, passing in the right arguments. 
  - Example: daily will call createElement('tracker', trackerObj) in order to get the HTML it needs to populate the mail.html. 
  - This means that whoever is making the daily object needs to know what the HTML template for the tracker is in order to correctly append it
  - I suggest having a template_(Obj-name).html for each element so that the people working on other parts knows what to expect from the created HTML element (especially when we have to add functionality to it, because for example: we need classes and ids to apply functionality to the correct element, can't work on something without know what it looks like)

---

## Unique/Global functions

- fetchByID(id): 
  - converts input ID to the right object from the respective json file

- setMode(): 
  - set in the mode for the user, modes include:
    - `view-only`: user can't edit content of the page (for past pages)
    - `edit`: user can edit content of page (current and future pages)
    - `labeling`: user can only label existing bullets on that page
    - `review/migration`: **migration process needs to be discussed**
    - (add more modes if needed)

## Features that this design supports

- Labeling bullets
- Adding/removing widgets/sections
- Monthly shows collected tracking data as graphs or something
- Viewing past logs 
- Editing future logs
- (No idea how to do Migration, **need to be discuss**)

# Un-processed notes
 When moving to the future  
 - How
    - User can either zoom out and click on target day
    - Press the forward button to edit a future date as if were today
 - Disable AKA Grey out:
    - trackers
    - add widgets button
 Use a current date global variable 
 Don't modify the global variables

 When moving to the past
 - EVERYTHING IS DISABLED
 - If BuJu extends past midnight do we lock the user out?
  - No, we shouldn't but how?
    - Option: +1 day in the past modifiable
    - Option: User can set cut-off hour (e.g. 2am)
    - **Option**: First time modified past midnight, user is notified that this entry will lock
      - Up to 3 hours afterwards
      - "Is your day over yet? (Note: this day will no longer be modifiable)"
        - Yes: lock the entry
        - No: lock the entry after user exits or after long enough inactivity hour 
          - 1/2hour -1hour ish
      - Maybe prompt only if they have unfinished tasks

 functions to implement:
  - Constructor(s) for each object type (bullet, label, dailyLog, monthlyLog, yearlyLog, widget, section), 
    - construct them into JS objects
    - DocElementConstructor(s) for each object type
      - takes in the Object
      - spits out an HTML element (using its own template)
      - Displayed by appending to main html 

## Migration
- Button/Tab
  - number indicator within circle (notif pts)
  - expands onClick
    - migrate mode perhaps?
    - User can mass check off, migrate to today, or cross off
