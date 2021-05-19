# Team 10 discussion Meeting
### Date: Monday, May 17
### Meeting Start Time: 4:05 PM PST
### Location: Zoom
### Present: Akar, Nathan, Sanat
### Absent: Akhilan, Asya, Brian, Huy, Ivan, Praneet, Ryan
## Discussion Points (cool stuff from other groups)
- Backend choices
  - `mongoDB` (x3)
    - `atlas` (x2)
  - `Express.js` (x2)
  - Schema choices
    - Journals, Pages, Sessions, Users
    - Journal-id based API-like access to journal data (json for now)
      - URL encoding to cut down on size
- Design choies 
  - Central notes with index, collections, calendars, and team mission statement?
  - Events, Tasks, and Notes as distinct objects (types of bullets)
  - Pop up menu when making and editing a bullet
    - Title, type, tags, time and date (not very rapid IMO)
    - Save and cancel button
  - Created bullets have a edit/delete button 
  - Create new tag button
  - OneNote style sidebar index
    - sections for classes
    - subsection for lectures
    - Add and Delete buttons
- Calendar
  - A lot of people are struggling with it (uh-oh)
  - A team relied on 3rd party code 
  - Another team did it with `CSS` and `flexbox/grid`
- `SPA` and `PWAs`
  - not mandatory
  - easier to implement if you start right off the bat
    - need to refactor architecture and design if you put it off
- Account System (x2)
  - Using `Express` to handle requests
  - Testing with `Postman`
  - Need to handle security
    - User's private notes need to be secure
    - `Bcrypt` used to hash passwords
    - Aiming to use `SSL` to encrypt body
  - Persistant login feature
  - Login with google (implementation details unknown)
- Text Editor
  - Input parsing input text to stylized content
  - Tabbing to create children notes
- Browser support testing
  - Advice from another group: Safari hates shadow DOM
  - `jsturgill/shadow-root-get-selection-polyfill` will solve your issues!
- Waynar (Team 11 member) offers to help
  - cursor inside HTMLElement
  - useful resource for if we decide to do the semi Vim-mode 
- A lot of teams have subteams working on experimental components
  - progress without a final product is still progress!
  - will link stuff together afterwards

 ## Sanat's Advice
- Make sure you have time to implement your design
- Maintain communication
- Refresh yourselves on customHTML Elements and Shadow DOMs
## Meeting End Time: 5:05 PM PST