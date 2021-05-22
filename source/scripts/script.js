import { Database } from '../classes/database.js';
import { dayjs } from '../scripts/dayjs.min.js';

// Load jQuery for cool effects :D
const script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-latest.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Load the dayOfYear plugin
dayjs.extend(window.dayjs_plugin_dayOfYear);

/**
 * Workflow (to be implemented):
 *    When DOC loads, get id of current day and load in current day's dailyObj from database
 *        or create new blank dailyObj
 *    Make HTML element from dailyObj and displays it
 *    forward backward buttons:
 *    backward loads the latest available dailyObj entry;
 *    forward creates a blank entry with the correct date, or reads in if it already exists:
 */

// Define variables used throughout all code here
// ----------------------------------------------

/**
 * Workflow (to be implemented):
 *    When DOC loads, get id of current day and load in current day's dailyObj from database
 *        or create new blank dailyObj
 *    Make HTML element from dailyObj and displays it
 *    forward backward buttons:
 *    backward loads the latest available dailyObj entry;
 *    forward creates a blank entry with the correct date, or reads in if it already exists:
 */

// Boolean to toggle editability
window.editable = true;
let editable = window.editable;

// Elements and buttons found on all pages
let btnZoomOut, btnAddSection;

// bulletNum counter and currentDate (based on entry, the actual currentDate will be generated whenever needed)
const bulNum = 0;
let currDate;

// Elements for the daily logs page
let divDaily, btnMinimizeSection;

// Elements for the monthly logs page
let divMonthly;

// Elements for the yearly logs page
let divYearlyIcons, divYearly;

// Array to store all sections that will have bullet points
let noteScts;
// -----------------------------------------------
// End of variable definition

/**
 * Wait for DOM to load before running script
 * @param {script.setupScript} cb - Callback that uses DOM content to setup script
 */
document.addEventListener('DOMContentLoaded', setupScript);

/**
 * Handles url navigation via the back/forward buttons
 * @param {PopStateEvent} event - info on target page contained in state
 * - Will finalize any user input
 * - Will log target view
 * - Will transition to target day/month/year
 * - If date is stored in state:
 *   - load the stored date, then load the day/month/year (will generate ID based off currDate)
 */
window.onpopstate = function (event) {
  finalizeInputs();
  console.log('Current state.log: ' + event.state.view);
  switch (event.state.view) {
    case 'day':
      if (event.state.currDate) {
        currDate = event.state.currDate;
        loadDay();
      } else {
        transitionDaily();
      }
      break;
    case 'month':
      if (event.state.currDate) {
        currDate = event.state.currDate;
        // loadMonth();
      } else {
        transitionMonthly();
      }
      break;
    case 'year':
      if (event.state.currDate) {
        currDate = event.state.currDate;
        // loadYear();
      } else {
        transitionYearly();
      }
      break;
  }
};

/**
 * Helper called once DOM has loaded
 * @callback script.setupScript
 * - Will load values into all declared variables
 * - Will update page to Daily Log view
 * - Will set up buttons
 */
function setupScript () {
  window.history.pushState({ view: 'day' }, 'Daily Log', '#daily');

  loadVars();
  setupButtons();
}

/** Values assigned to variables defined earlier - either default or loaded from DOM */
function loadVars () {
  currDate = dayjs();
  divDaily = document.getElementsByClassName('daily')[0];
  divMonthly = document.getElementsByClassName('monthly')[0];
  divYearly = document.getElementsByClassName('yearly')[0];
  divYearlyIcons = document.getElementsByClassName('icons-for-yearly')[0];

  btnZoomOut = document.getElementById('zoom-out-button');
  btnAddSection = document.getElementById('related-sections-button');
  btnMinimizeSection = document.getElementById('minimize-section');

  noteScts = document.getElementsByClassName('notes');
}

/**
 * Functionality applied to the following buttons:
 * - ZoomOut Button (magnifying glass)
 * - Bullet item (represented by li elements for now)
 * - Section body (button created to add a new note/bullet)
 * - Add Section Button
 * - Minimize Section Button
 */
function setupButtons () {
  btnZoomOut.addEventListener('click', zoomOut);

  document.querySelectorAll('li').forEach((listItem) => {
    listItem.addEventListener('click', (event) => { editBullet(event); });
  });

  for (let i = 0; i < noteScts.length; i++) {
    const btnAdd = document.createElement('button');
    btnAdd.innerText = '+';
    btnAdd.addEventListener('click', (event) => { addBullet(event); });
    noteScts[i].appendChild(btnAdd);
  }

  btnAddSection.addEventListener('click', createSection);

  btnMinimizeSection.addEventListener('click', () => {
    // eslint-disable-next-line no-undef
    $('ol').slideToggle();
  });
}

/**
 * ------------ DEPRECATED METHOD ----------
 * Will be replaced by @function createBullet
 * -----------------------------------------
 *
 * Creates a new bullet under target's parent (button's section) that triggered event
 * @param {OnClickEvent} event
 * - Function only run if editting is enable
 * - New list item with input textbox appended to parent section (user directed to inside input)
 * - Editing is disabled
 * - Input box triggers action upon reading 'Enter':
 *  - Textbox value used to create new list item
 *  - New list item replaces the 'input' list item
 *  - Editing is enabled
 */
function addBullet (event) {
  if (editable === true) {
    const parent = event.target.parentElement;
    // console.log(target.innerHTML);

    const newBullet = document.createElement('li');
    const input = document.createElement('input');
    input.id = 'newBullet';

    newBullet.appendChild(input);
    parent.replaceChild(newBullet, event.target);
    input.focus();

    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const result = document.createElement('li');
        result.innerHTML = input.value + '\n';

        result.addEventListener('click', editBullet);
        parent.replaceChild(result, newBullet);
        editable = true;
      }
    });

    parent.appendChild(event.target);
    editable = false;
  }
}

/**
 * Edits existing bullet when clicked on
 * @param {OnClickEvent} event
 * - Function only runs if editting is enabled AND only for the list item clicked (for nested list items)
 * - Input textbox created with value of first line of list item (in case list item has children)
 *  - Texbox replaces first child of list item (again in case list item has children) and user is directed inside textbox
 * - Editing is disabled
 * - Input box triggers helper funciton upon reading 'Enter':
 *  - Editing will be enabled within
 */
function editBullet (event) {
  if (editable && event.target.innerText === event.currentTarget.innerText) {
    const target = event.target;
    // console.log(JSON.stringify(target.innerHTML));

    const input = document.createElement('input');
    input.value = target.innerText.split('\n')[0];
    input.id = 'newBullet';

    target.innerHTML = '<input>' + target.innerHTML.split('\n').slice(1).join('\n');
    // console.log(JSON.stringify(target.innerHTML));
    target.replaceChild(input, target.children[0]);
    input.focus();

    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        inputToBullet(input, target);
      }
    });

    editable = false;
  }
}

/**
 * Finds any open inputs and finalizes the process of transforming inputs to bullets
 */
function finalizeInputs () {
  const input = document.getElementById('newBullet');
  if (input) {
    inputToBullet(input, input.parentElement);
  }
}

/**
 * Replaces input textbox with it's value in the list item
 * @param {HTMLElement} input - input textbox
 * @param {HTMLElement} target - list item that's parent of input
 * - Creates a new list item
 *  - Value of input text appended
 * - Iterates through all children of original list item
 *  - Adds a clickListener to each list item within to allow modifying afterwards
 * - New list item itself is given a clickListener to allow edits
 * - Old list item replaced with new list item
 * - Editing re-enabled
 */
function inputToBullet (input, target) {
  const result = document.createElement('li');
  result.innerHTML = input.value + '\n';

  const children = target.children;
  for (let i = 1; i < children.length; i++) {
    children[i].querySelectorAll('li').forEach((listItem) => {
      listItem.addEventListener('click', editBullet);
    });
    result.append(children[i]);
  }

  result.addEventListener('click', editBullet);
  target.parentElement.replaceChild(result, target);

  editable = true;
}

/**
 * Zooms out to appropriate day based off history state
 * - finalizes any inputs first
 * - logic: day -> month -> year
 *  - pushes state and transitions for appropriate view
 */
function zoomOut () {
  finalizeInputs();
  // console.log('You clicked on the zoom out button');
  switch (history.state.view) {
    case 'day':
      window.history.pushState({ view: 'month' }, 'Monthly Log', '#month');
      transitionMonthly();
      break;
    case 'month':
      window.history.pushState({ view: 'year' }, 'Yearly Log', '#year');
      transitionYearly();
      break;
  }
}

/**
 * Handles transitioning from Monthly view to Daily view
 */
function transitionDaily () {
  divDaily.style.display = 'block';
  divMonthly.style.display = 'none';
}

/**
 * Handles transitioning from either Daily or Yearly view to Monthly view
 */
function transitionMonthly () {
  divDaily.style.display = 'none';
  divMonthly.style.display = 'block';
  divYearly.style.display = 'none';

  divYearlyIcons.style.display = 'none';
  btnZoomOut.style.display = 'block';
}

/** Handles transitioning from Monthly view to Yearly view */
function transitionYearly () {
  divMonthly.style.display = 'none';
  divYearly.style.display = 'block';

  divYearlyIcons.style.display = 'block';
  btnZoomOut.style.display = 'none';
}

/**
 * TODO
 *
 * Will be implemented later once we create a custom html element for sections
 * - Triggered by the (+) section button near top of daily log
 *
 * In case of linter complaints, breka asterisk --> */
function createSection () {
  console.log('You clicked on the create section button');
}
/* For quick commenting out of code */

// New & unprocessed code -----------------------------------------------------------------------

/**
 * Creates and appends a new bullet entry based on target of clickEvent
 * @param {OnClickEvent} event
 * - Function only run if editting is enable
 * - New bullet item with input textbox appended to parent section (user directed to inside input)
 * - Editing is disabled
 * - Input box triggers action upon reading 'Enter':
 *  - Textbox value used to update bullet item
 *  - Editing is enabled
 *
 * In case of linter complaints, break asterisk --> /
function createBullet () {
  const bulletElem = document.createElement('bullet-entry');
  const bulletObj = [];
}
/* For quick commenting out of code */

/**
 * Loads the current day into display
 * - Generates ID and checks database for the day
 * - If ID is registered, sets data with data from database
 * - If not, creates a blank teplate
 *
 * In case of linter complaints, break asterisk --> */
function loadDay () {
  const ID = generateID('day');
  const dayElem = document.createElement('day');
  Database.fetch(ID, (data) => {
    if (data) {
      dayElem.data = [ID, data];
    } else {
      console.log("Dunno if this is an error or if the ID just wan't found so we'll just make a new Day ._.");
      dayElem.data = [ID, {
        widgets: [],
        trackers: [],
        sections: [
          {
            name: 'Notes',
            type: 'log',
            bulletIDs: []
          }
        ]
      }];
    }
  });
}

/**
 * Uses global variables to generate the correct ID for the given object type
 *
 * @param {string} type - Type of data object to generate ID for
 * @returns {string} The objects ID
 *
 * In case of linter complaints, break asterisk --> */
function generateID (type) {
  let ID = '';
  let day = currDate.date();
  day = (day < 10 ? '0' : '') + day;
  let month = currDate.month();
  month = (month < 10 ? '0' : '') + month;
  const year = currDate.year() % 100;

  switch (type) {
    case 'day':
      return `D ${year}${month}${day}`;
    case 'bullet':
      switch (window.history.state.view) {
        case 'day' :
          ID = `B ${year}${month}${day} 00 ${bulNum}`;
          return ID;
        case 'month' :
          ID = `B ${year}${month} ${bulNum}`;
          return ID;
        case 'year' :
          ID = `B ${year} 0 ${bulNum}`;
          return ID;
      }
      break;
    default:
      console.log(`No implementation yet for generating ${type} IDs`);
  }
}
/* For quick commenting out of code */

/**
 * Adds functionality to 'Next Unit' button
 * - Record currentDate in history state
 * - Navigate to the next unit (day/month/year)
 *
 * In case of linter complaints, break asterisk --> /
function onNextUnit () {
  finalizeInputs();
  switch (history.state.view) {
    case 'day':
      window.history.pushState({ view: 'day', currDate }, 'Daily Log', '#day');
      currDate = currDate.dayOfYear(currDate.dayOfYear() + 1);
      loadDay();
      break;
    case 'month':
      window.history.pushState({ view: 'month', currDate }, 'Monthly Log', '#month');
      currDate = currDate.month(currDate.month() + 1);
      loadDay();
      break;
    case 'year':
      window.history.pushState({ view: 'year,', currDate }, 'Yearly Log', '#year');
      currDate = currDate.year(currDate.year() + 1);
      break;
  }
}
/* For quick commenting out of code */

/**
 * Adds functionality to 'Prev Unit' button
 * - Record currentDate in history state
 * - Navigate to the previous unit (day/month/year)
 *
 * In case of linter complaints, break asterisk --> /
function onPrevUnit () {
  finalizeInputs();
  switch (history.state.view) {
    case 'day':
      window.history.pushState({ view: 'day', currDate }, 'Daily Log', '#day');
      currDate = currDate.dayOfYear(currDate.dayOfYear() - 1);
      loadDay();
      break;
    case 'month':
      window.history.pushState({ view: 'month', currDate }, 'Monthly Log', '#month');
      currDate = currDate.month(currDate.month() - 1);
      loadDay();
      break;
    case 'year':
      window.history.pushState({ view: 'year,', currDate }, 'Yearly Log', '#year');
      currDate = currDate.year(currDate.year() - 1);
      break;
  }
}
/* For quick commenting out of code */

/**
 * TODO
 *
 * Provides functionality to the 'Next Entry' button
 * - Records currentDate in history's state
 * - Navigates to next Entry (daily view only)
 *
 * In case of linter complaints, break asterisk --> /
function onNextEntry(forward) {
}
/* For quick commenting out of code */

/**
 * TODO
 *
 * Provides functionality to the 'Prev Entry' button
 * - Records currentDate in history's state
 * - Navigates to previous Entry (daily view only)
 *
 * In case of linter complaints, break asterisk --> /
function onPrevEntry(forward) {
}
/* For quick commenting out of code */

/**
 * TODO
 *
 * Provides functionality to calendar view in yearly/monthly logs
 * - Zooms into the correct month or date
 * - Sets currDate accordingly
 *
 * In case of linter complaints, break asterisk --> /
function zoomIn () {
  // When user click on a button in yearly or monthly
  // zoom into the correct month or date
  // sets day, month, year to correct date.
}
/* For quick commenting out of code */

// Notes and old code -------------------------------------------------------------------------------

/** Working with Local Storage
 * ----------------------------
 * 1. Check localstorage
 * 2. load global variables
 * 3. onChange, update global variables
 * 4. when exiting, write to localstorage
 */

/*
$(document).click(function(event) {
  var $target = $(event.target);
  if(!$target.closest('#menucontainer').length &&
  $('#menucontainer').is(":visible")) {
    $('#menucontainer').hide();
  }
});
*/

// Old code for adding evenListeners to all 'li' items
/*
document.querySelectorAll('li').forEach((listItem)=>{
    listItem.addEventListener('click', (event) => {
        let target = event.target;
        let input = document.createElement('input');
        input.value = target.innerText.split('\n')[0];

        input.addEventListener('submit', () => {
            let result = document.querySelector('')
            savedText.textContent = input;
        });

        target.innerHTML = '<input>'+target.innerHTML.split('\n').slice(1).join('');
        target.replaceChild(input, target.children[0]);
    })
})
*/

// sctLogs.addEventListener('click', ()=> {
//     let inputBox = document.createElement('input');
//     inputBox.type = 'text';
//     document.getElementById('daily-log').appendChild(inputBox);
// });
