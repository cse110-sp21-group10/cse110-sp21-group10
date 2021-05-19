# Local Storage Flow Outline
## Flow
1. User opens the log
2. Retrieve existing notes from storage
3. Convert notes to HTML elements and display them
    1. Store corresponding id with the element
4. New Note Process
    1. User clicks to add new note
    2. User types out their note, clicks [Enter] to finish the note ([Shift-Enter] can be used to create a newline within the same note)
    3. When [Enter] is clicked to finish a new note, assign an ID to the note and create a new JSON object with the section name, note text, and parent (if applicable)
    4. Get the list of daily/monthly/yearly log note IDs from localStorage (ex. `let dailyNotes = JSON.parse(localStorage.getItem('daily'))`) and append the ID of the new note to the array
    5. Update the localStorage with the new array (ex. `localStorage.setItem('daily', dailyNotes)`)
    6. Update the localStorage with the new note (ex. `localStorage.setItem(noteID, noteObject)`)
    7. If the note is a subnote, update the parent in localStorage to add the new child (ex. `let parentNote = JSON.parse(localStorage.getItem(noteObject.parent))`; append child and re-store the parent note)
5. Update Note Process
   1. User clicks on an existing note to edit it
   2. User clicks [Enter] to finish editing the note
   3. Get note ID from the HTML element that was edited
   4. Update the localStorage with the new note contents (ex. `JSON.parse(localStorage.getItem(noteID))`; update the note attribute and re-store the note)
6. Remove Note Process
   1. User clicks on an 'X' or deletes contents of the note or something to remove note
   2. Get the list of daily/monthly/yearly log note IDs from localStorage (ex. `let dailyNotes = JSON.parse(localStorage.getItem('daily'))`) and remove the ID of the new note from the array
   3. Update the localStorage with the new array (ex. `localStorage.setItem('daily', dailyNotes)`)
   4. Get the note object from localStorage
   5. If the note has any children, remove those children from localStorage (`localStorage.removeItem(noteID)`)
   6. If the note has a parent, get the parent note and remove this note's ID from the parent's list of children
7. Migration Process
   1. User clicks on some button to migrate a specific note
   2. Get note ID from the HTML element that is being migrated
   3. Update the note's date in localStorage

## Structure
1. localStorage is a collection of string key-value pairs (everything gets stringified when it gets stored in localStorage so we have to make sure to convert it to the appropriate format when using it), so the storage would look like:
```javascript
// each item is a key/value pair on the outermost level
{ 
    'daily': [1, 2, 6, 12, 34, ...],
    'monthly': '[3, 7, 13, 14, 15, 16, 20, ...]',
    'yearly': '[4, 5, 8, 9, 10, 11, 17, 18, 19, ...]',
    '1': {
        date: {day: 0, month: 5, date: 16, year: 2021}
        section: 'Daily Notes',
        note: 'note text',
        children: [2,12]
    },
    '2': {
        date: {day: 0, month: 5, date: 16, year: 2021}
        section: 'Daily Notes',
        note: 'sub note text',
        children: [34]
        parent: 1
    },
    '3': {
        date: {month: 5, year: 2021}
        section: 'Monthly Notes',
        note: 'note text',
        children: [14,15]
    },
    '4': {
        date: {year: 2021}
        section: 'Yearly Notes',
        note: 'note text',
        children: [11,19]
    },
    '5': {
        date: {year: 2021}
        section: 'Yearly Goals',
        note: 'note text',
    },
    '6': {
        date: {day: 4, month: 5, date: 20, year: 2021}
        section: 'Daily Shopping List',
        note: 'list item text',
    },
    ...
}
```
2. Possible sections would include, for example, 'Daily Notes', 'Daily Shopping List' (these would go in the Daily Log), 'Yearly Goals', 'Yearly Notes' (these would go in the Yearly Log), 'Monthly Notes' (this would go in the Monthly Log)
3. Primary methods for reading/writing notes to localStorage are:
```javascript
localStorage.setItem(noteID, noteObject);
let note = localStorage.getItem(noteID);
localStorage.removeItem(noteID);
```