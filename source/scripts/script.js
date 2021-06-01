import { Database } from '../classes/database.js';

/*
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
// Elements and buttons found on all pages
let btnZoomOut, btnNextUnit, btnPrevUnit; //, btnNextEntry, btnPrevEntry;

// currentDate - based on entry, the actual currentDate will be generated whenever needed)
let currDate = new Date();

// Elements for the daily logs page
let divDaily;

// Elements for the monthly logs page
let divMonthly;

// Elements for the yearly logs page
let divYearly;
// -----------------------------------------------
// End of variable definition

/**
 * Wait for DOM to load before running script
 * @param {setupScript} cb - Callback that uses DOM content to setup script
 */
document.addEventListener('DOMContentLoaded', setupScript);

/**
 * Handles url navigation via the back/forward buttons <p>
 *
 * Will finalize any user input through the use of a finalizeInputs,
 * determines which log to load into view based off current view and calls the appropriate transition function
 * (transitionDaily, transitionMonthly, transitionYearly.) <p>
 *
 * Edit: Will also check if history state stored a date, indicating movement to another Unit/Entry occurred. <p>
 *
 * If this is the case, the old date is loaded into currDate and the appropriate load function is called
 * (loadDay, loadMonth, loadYear)
 * @param {PopStateEvent} event - info on target page contained in state
 */
window.onpopstate = function (event) {
  console.log('Current state.log: ' + event.state.view);
  switch (event.state.view) {
    case 'day':
      if (event.state.date) {
        currDate = event.state.date;
        loadDay();
      } else {
        transitionDaily();
      }
      break;
    case 'month':
      if (event.state.date) {
        currDate = event.state.date;
        // loadMonth();
      } else {
        transitionMonthly();
      }
      break;
    case 'year':
      if (event.state.date) {
        currDate = event.state.date;
        // loadYear();
      } else {
        transitionYearly();
      }
      break;
  }
};

/**
 * Helper called once DOM has loaded. <p>
 *
 * Will immediately push a state indicating current view is set to daily log to window history, <p>
 *
 * calls loadVars to load values into declared variables, <p>
 *
 * calls setupButtons to add onClickListeners to buttns
 * @callback setupScript
 */
function setupScript () {
  window.history.replaceState({ view: 'day', date: currDate }, 'Daily Log', '#daily');

  loadVars();
  setupButtons();

  loadDay();
  /* For testing purposes /
  createBullet();
  createBullet();
  createBullet();
  /* For quickly commenting out */
}

/**
 * Values assigned to variables defined earlier <p>
 *
 *
 * Classnames used to load divs for the 3 views, the associated icon group, and all bullet elements
 * (currently sections holding list elements but will be replaced once custom bullet element is defined) <p>
 *
 * IDs used to load button elements
 */
function loadVars () {
  divDaily = document.getElementsByClassName('daily')[0];
  divMonthly = document.getElementsByClassName('monthly')[0];
  divYearly = document.getElementsByClassName('yearly')[0];

  btnZoomOut = document.getElementById('zoom-out-button');
  btnNextUnit = document.getElementById('next-day');
  btnPrevUnit = document.getElementById('prev-day');
  // btnNextEntry = document.getElementById('last-entry-forward');
  // btnPrevEntry = document.getElementById('last-entry-back');
}

/**
 * Functionality applied via onClickListeners to the following buttons: <p>
 *
 * Zoom Out button - using zoomOut <p>
 *
 * Bullet items - using editBullet <p>
 *
 * Add bullet buttons (that are dynamically added to each section) - using addBullet <p>
 *
 * Create section button - using createSection <p>
 *
 * Minimize section button - using jQuery's slideToggle function
 */
function setupButtons () {
  btnZoomOut.addEventListener('click', zoomOut);
  btnNextUnit.addEventListener('click', onNextUnit);
  btnPrevUnit.addEventListener('click', onPrevUnit);
}

/**
 * Zooms out to appropriate view based off history state <p>
 *
 * Calls finalizeInputs to finish any bullets that are being editted <p>
 *
 * Checks the current history state's view to determine which transition to make <p>
 *
 * Pushes the current view to history state and calls appropriate transition function
 * (transitionMonthly, transitionDaily)
 */
function zoomOut () {
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
 * Handles transitioning from Monthly view to Daily view <p>
 *
 * Daily div is set to visible, Monthly div is set to invisible <p>
 *
 * Icon groups for entry jumping are made available to Daily view
 */
function transitionDaily () {
  divDaily.style.display = 'block';
  divMonthly.style.display = 'none';
  // divEntryNav.style.display = 'block';
}

/**
 * Handles transitioning from either Daily or Yearly view to Monthly view <p>
 *
 * Daily and Yearly div is set to invisible, Monthly div is set to visible <p>
 *
 * Icon groups for entry jumping are made unavailable to Monthly and Yearly view <p>
 *
 * Zoom out icon is enabled in Monthly and Daily view
 */
function transitionMonthly () {
  divDaily.style.display = 'none';
  divMonthly.style.display = 'block';
  divYearly.style.display = 'none';

  // divEntryNav.style.display = 'none';
  btnZoomOut.style.disabled = 0;
}

/**
 * Handles transitioning from Monthly view to Yearly view <p>
 *
 * Yearly div is set to visible, Monthly div is set to invisible <p>
 *
 * Zoom out icon is disabled in Yearly View
 */
function transitionYearly () {
  divMonthly.style.display = 'none';
  divYearly.style.display = 'block';

  btnZoomOut.style.disabled = 1;
}

/**
 * TODO <p>
 *
 * Will be implemented later once we create a custom html element for sections <p>
 *
 * Triggered by the (+) section button near top of daily log <p>
 *
 *
function createSection () {
  console.log('You clicked on the create section button');
}
/* For quick commenting out of code */

// New & unprocessed code -----------------------------------------------------------------------

/**
 * Loads the current day into display <p>
 *
 * Calls generateID, attempts to use ID to retrieve data for the current day <p>
 *
 * If data is returned, calls on day custom element's setter for data <p>
 *
 * Otherwise, either an error occurred or ID isn't registered <p>
 *
 * Regardless, day custom element's blank setter is called <p>
 *
 * In both cases, the day element is appended to appropriate location in document (TODO)
 *
 */
function loadDay () {
  const ID = generateID('day');
  const dayElem = document.createElement('daily-log');
  Database.fetch(ID, (data) => {
    if (data) {
      dayElem.data = [ID, data];
    } else {
      console.log("Dunno if this is an error or if the ID just wan't found so we'll just make a new (template) Day ._.");
      dayElem.data = [ID, {}];
    }
  });
  // apend dayElem somewhere
  divDaily.remove();
  divDaily = dayElem;
  document.getElementById('internal-content').appendChild(dayElem);
}

/**
 * Uses currDate to generate the correct ID for the given object type <p>
 *
 * Creates 2-digit YY, MM, and DD from currDate variables to use in ID generation <p>
 *
 * Figures out which ID format to generate based off type and generates correct ID
 * (refer to Design Notes and data models for examples of ID formats)
 *
 * @param {string} type - Type of data object to generate ID for
 * @returns {string} The objects ID
 *
 */
export function generateID (type) {
  let day = currDate.getDate();
  day = (day < 10 ? '0' : '') + day;
  let month = currDate.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;
  const year = currDate.getFullYear() % 100;

  switch (type) {
    case 'day':
      return `D ${year}${month}${day}`;
    default:
      console.log(`No implementation yet for generating ${type} IDs`);
  }
}
/* For quick commenting out of code */

/**
 * Adds functionality to 'Next Unit' button <p>
 *
 * Calls finalizeInputs to ensure no bullets are currently being modified <p>
 *
 * Records currentDate in history state, then navigates to the next unit with appropriate load function
 * (loadDay, loadMonth, loadYear)
 *
 */
function onNextUnit () {
  switch (history.state.view) {
    case 'day':
      currDate.setDate(currDate.getDate() + 1);
      window.history.pushState({ view: 'day', date: currDate }, 'Daily Log', '#day');
      loadDay();
      break;
    case 'month':
      currDate.setMonth(currDate.getMonth() + 1, 1);
      window.history.pushState({ view: 'month', date: currDate }, 'Monthly Log', '#month');
      // loadMonth();
      break;
    case 'year':
      currDate.setFullYear(currDate.getFullYear() + 1);
      window.history.pushState({ view: 'year,', date: currDate }, 'Yearly Log', '#year');
      // loadYear();
      break;
  }
}
/* For quick commenting out of code */

/**
 * Adds functionality to 'Prev Unit' button <p>
 *
 * Calls finalizeInputs to ensure no bullets are currently being modified <p>
 *
 * Records currentDate in history state, then navigates to the previous unit with appropriate load function
 * (loadDay, loadMonth, loadYear)
 *
 */
function onPrevUnit () {
  switch (history.state.view) {
    case 'day':
      currDate.setDate(currDate.getDate() - 1);
      window.history.pushState({ view: 'day', date: currDate }, 'Daily Log', '#day');
      loadDay();
      break;
    case 'month':
      currDate.setMonth(currDate.getMonth() - 1, 1);
      window.history.pushState({ view: 'month', date: currDate }, 'Monthly Log', '#month');
      loadDay();
      break;
    case 'year':
      currDate.setYear(currDate.getFullYear() - 1);
      window.history.pushState({ view: 'year,', date: currDate }, 'Yearly Log', '#year');
      break;
  }
}
/* For quick commenting out of code */

/**
 * TODO
 *
 * Provides functionality to the 'Next Entry' button <p>
 *
 * Function only runs in daily view <p>
 *
 * Calls finalizeInputs to ensure no bullets are currently being modified <p>
 *
 * Records currentDate in history state, then navigates to the next Entry
 *
 *
function onNextEntry(forward) {
  if (window.history.state.view === 'day') {
    finalizeInputs();
  }
}
/* For quick commenting out of code */

/**
 * TODO
 *
 * Provides functionality to the 'Prev Entry' button <p>
 *
 * Function only runs in daily view <p>
 *
 * Calls finalizeInputs to ensure no bullets are currently being modified <p>
 *
 * Records currentDate in history state, then navigates to the previous Entry
 *
function onPrevEntry(forward) {
  if (window.history.state.view === 'day') {
    finalizeInputs();
  }
}
/* For quick commenting out of code */

/**
 * TODO
 *
 * Provides functionality to calendar view in yearly/monthly logs <p>
 *
 * Access to contents (and therefor target date) in the element that was triggered through event param <p>
 *
 * Set's currDate accordingly <p>
 *
 * Reads history state's current view to decide whether to transition to Monthly or Daily view,
 * then calls appropriate load function (loadDay, loadMonth)
 *
 * @param {OnClickEvent} event
 *
function zoomIn (event) {
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
