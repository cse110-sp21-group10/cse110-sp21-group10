import { Database } from '../classes/database.js';
import { IDConverter } from '../classes/IDConverter.js';
import * as indexJs from './index.js';

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

// Elements and buttons found on all pages
let btnZoomOut, btnNextUnit, btnPrevUnit, btnNextEntry, btnPrevEntry;

// Vars used to setup entry indexing
let index, entries;

// currentDate  based on entry, the actual currentDate will be generated whenever needed)
let currDate = new Date();

// Elements for the daily logs page
let dailyLog;

// Elements for the monthly logs page
let monthlyLog;

// Elements for the yearly logs page
let yearlyLog;
// -----------------------------------------------

// Labels object for mapping label names to colors
export const labels = {
  finance: {
    color: 'green'
  },
  fitness: {
    color: 'darkviolet'
  },
  academics: {
    color: 'grey'
  },
  household: {
    color: 'orange'
  },
  work: {
    color: 'red'
  },
  leisure: {
    color: 'blue'
  }
};
// End of variable definition

/**
 * Wait for DOM to load before running script
 * @param {setupScript} cb - Callback that uses DOM content to setup script
 */
document.addEventListener('DOMContentLoaded', setupScript);

/**
 * Handles history navigation <p>
 *
 * Determines which log to load into view based off current view and calls the appropriate transition function
 * (transitionDaily, transitionMonthly, transitionYearly.) <p>
 *
 * Will also check if history state stored a date, indicating movement to another Unit/Entry occurred. <p>
 *
 * If this is the case, the old date is loaded into currDate and the appropriate load function is called
 * (loadDay, loadMonth, loadYear)
 * @param {PopStateEvent} event - info on target page contained in state
 */
window.onpopstate = function (event) {
  console.log('Current state.log: ' + event.state.view);
  switch (event.state.view) {
    case 'day':
      transitionDaily();
      currDate = event.state.date;
      loadDay();
      updateIndex();
      break;
    case 'month':
      currDate = event.state.date;
      loadMonth();
      transitionMonthly();
      break;
    case 'year':
      currDate = event.state.date;
      loadYear();
      transitionYearly();
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
  loadVars();
  setupButtons();

  // Fetches style from database and calls on helper to apply it
  Database.fetch('S', (data) => {
    if (data) {
      indexJs.style.fontType = data.fontType;
      indexJs.style.themeType = data.themeType;
      indexJs.loadStyle();
    } else {
      console.log('No style was set yet!');
    }
  });

  if (!history.state) {
    window.history.replaceState({ view: 'day', date: currDate }, 'Daily Log', '#day');
  } else {
    currDate = history.state.date;
  }

  switch (history.state.view) {
    case 'day':
      loadDay();
      transitionDaily();
      break;
    case 'month':
      loadMonth();
      transitionMonthly();
      break;
    case 'year':
      loadYear();
      transitionYearly();
      break;
  }
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
  dailyLog = document.getElementsByTagName('daily-log')[0];
  monthlyLog = document.getElementsByTagName('monthly-log')[0];
  yearlyLog = document.getElementsByTagName('yearly-log')[0];

  btnZoomOut = document.getElementById('zoom-out-button');

  btnNextUnit = document.getElementById('next-day');
  btnPrevUnit = document.getElementById('prev-day');

  btnNextEntry = document.getElementById('last-entry-forward');
  btnPrevEntry = document.getElementById('last-entry-back');

  Database.getEntryKeys((data) => {
    entries = data;
    updateIndex();
  });
}

/**
 * Appends a weather HTML div that shows the weather but only on the current day's daily log. <p>
 *
 * The weather is pulled from a third-party API based on the location of the client browser. The
 * weather temperature starts off with fahrenheit units to begin with but can changed when the user
 * clicks on it. <p>
 *
 * In the case of a fetch error or other error, it defaults to a question-mark style denoting unknown.
 */
function appendWeather () {
  // check if we are looking at today's daily log (we don't want to display weather on other logs)
  const todayDate = new Date();
  if (currDate.getDate() === todayDate.getDate() &&
      currDate.getMonth() === todayDate.getMonth() &&
      currDate.getFullYear() === todayDate.getFullYear()) {
    // create weather div container and append it to the daily log's header
    const weatherDiv = document.createElement('div');
    weatherDiv.className = 'container';
    weatherDiv.innerHTML = `
      <div class="weather-container">
        <div class="weather-icon">
          <img src="../assets/icons/unknown.png" alt="">
        </div>
        <div class="temperature-value">
          <p>&nbsp °<span>F</span></p>
        </div>
        <div class="temperature-description">
            <p>-</p>
        </div>  
      </div>
    `;
    const newSectionButton = dailyLog.shadowRoot.querySelector('#related-sections-button');
    dailyLog.shadowRoot.querySelector('#daily-header').insertBefore(weatherDiv, newSectionButton);
    // Select Elements
    const iconElement = weatherDiv.querySelector('.weather-icon');
    const tempElement = weatherDiv.querySelector('.temperature-value p');
    const descElement = weatherDiv.querySelector('.temperature-description p');
    // const locationElement = this.shadowRoot.querySelector(".location p");
    // const notificationElement = this.shadowRoot.querySelector(".notification");

    // Data
    const weather = {};

    weather.temperature = {
      unit: 'celsius'
    };

    // Constants and variables
    const KELVIN = 273;
    // API key
    const key = '3f70f77aa960728d939b3bee01d7bbda';

    // Check if browser supports geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
      console.error("Browser Doesn't Support Geolocation");
    }

    // Set user's position
    function setPosition (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      getWeather(latitude, longitude);
    }

    // Show error when there is an issue with geolocation service
    function showError (error) {
      console.error(error.message);
    }

    // Get weather from API provider
    function getWeather (latitude, longitude) {
      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

      console.log(api); // FIXME

      fetch(api)
        .then(function (response) {
          const data = response.json();
          return data;
        })
        .then(function (data) {
          weather.temperature.value = Math.floor(data.main.temp - KELVIN);
          weather.description = data.weather[0].description;
          weather.iconId = data.weather[0].icon;
          weather.city = data.name;
          weather.country = data.sys.country;
        })
        .then(function () {
          displayWeather();
        });
    }

    // Display weather to UI
    function displayWeather () {
      if (document.getElementsByTagName('html')[0].className != '') {
        iconElement.innerHTML = `<img src="../assets/icons/${weather.iconId}_d.png"/>`;
      }
      else {
        iconElement.innerHTML = `<img src="../assets/icons/${weather.iconId}.png"/>`;
      }
      tempElement.innerHTML = `${Math.floor(celsiusToFahrenheit(weather.temperature.value))}°<span>F</span>`;
      descElement.innerHTML = weather.description;
      weather.temperature.unit = 'fahrenheit';
      // locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    }

    // C to F conversion
    function celsiusToFahrenheit (temperature) {
      return (temperature * 9 / 5) + 32;
    }

    // When the user clicks on the temperature element
    tempElement.addEventListener('click', function () {
      if (weather.temperature.value === undefined) return;

      if (weather.temperature.unit === 'fahrenheit') {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = 'celsius';
      } else {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = 'fahrenheit';
      }
    });
  }
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

  btnNextUnit.addEventListener('click', () => { navigateUnit(1); });
  btnPrevUnit.addEventListener('click', () => { navigateUnit(-1); });

  btnNextEntry.addEventListener('click', () => { navigateEntry(1); });
  btnPrevEntry.addEventListener('click', () => { navigateEntry(-1); });
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
      window.history.pushState({ view: 'month', date: currDate }, 'Monthly Log', '#month');
      loadMonth();
      transitionMonthly();
      break;
    case 'month':
      window.history.pushState({ view: 'year', date: currDate }, 'Yearly Log', '#year');
      loadYear();
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
  dailyLog.style.display = 'block';
  monthlyLog.style.display = 'none';
  yearlyLog.style.display = 'none';

  btnPrevEntry.disabled = 0;
  btnNextEntry.disabled = 0;
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
  dailyLog.style.display = 'none';
  monthlyLog.style.display = 'block';
  yearlyLog.style.display = 'none';

  // divEntryNav.style.display = 'none';
  btnZoomOut.disabled = 0;
  btnZoomOut.style.cursor = 'pointer';

  btnPrevEntry.disabled = 1;
  btnNextEntry.disabled = 1;
  btnZoomOut.style.backgroundColor = '';
}

/**
 * Handles transitioning from Monthly view to Yearly view <p>
 *
 * Yearly div is set to visible, Monthly div is set to invisible <p>
 *
 * Zoom out icon is disabled in Yearly View
 */
function transitionYearly () {
  dailyLog.style.display = 'none';
  monthlyLog.style.display = 'none';
  yearlyLog.style.display = 'block';

  btnZoomOut.disabled = 1;
  btnZoomOut.style.cursor = 'default';

  btnPrevEntry.disabled = 1;
  btnNextEntry.disabled = 1;

  btnZoomOut.style.backgroundColor = 'transparent';
}

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
 * @param {string} ID - Day ID used to load current date, defaults to generation if not provided
 */
function loadDay (ID = IDConverter.generateID('day', currDate)) {
  const dayElem = document.createElement('daily-log');
  Database.fetch(ID, (data) => {
    if (data) {
      dayElem.data = [ID, data, updateEntries];
    } else {
      console.log('Creating a new template daily-log element');
      dayElem.data = [ID, {}, updateEntries];
    }
  });
  // append dayElem to internal content
  dailyLog.shadowRoot.querySelector('div.daily').style.display = 'block';
  document.getElementById('internal-content').replaceChild(dayElem, dailyLog);
  dailyLog = dayElem;
  dailyLog.style.display = 'block';
  appendWeather();
}

/**
 * Description here
 *
 */
function loadMonth (ID = IDConverter.generateID('month', currDate)) {
  const monthElem = document.createElement('monthly-log');
  Database.fetch(ID, (data) => {
    if (data) {
      monthElem.data = [ID, data, zoomIn];
    } else {
      console.log('Creating a new template monthly-log element');
      monthElem.data = [ID, {}, zoomIn];
    }
  });
  // apend monthElem to internal content
  monthElem.shadowRoot.querySelector('div.monthly').style.display = 'block';
  document.getElementById('internal-content').replaceChild(monthElem, monthlyLog);
  monthlyLog = monthElem;
  monthlyLog.style.display = 'block';
}

/**
 * Description here
 *
 */
function loadYear (ID = IDConverter.generateID('year', currDate)) {
  const yearElem = document.createElement('yearly-log');
  Database.fetch(ID, (data) => {
    if (data) {
      yearElem.data = [ID, data, zoomIn];
    } else {
      console.log('Creationg a new template yearly-log element');
      yearElem.data = [ID, {}, zoomIn];
    }
  });
  // append yearElem to internal content
  yearElem.shadowRoot.querySelector('div.yearly').style.display = 'grid';
  document.getElementById('internal-content').replaceChild(yearElem, yearlyLog);
  yearlyLog = yearElem;
  yearlyLog.style.display = 'block';
}

/**
 * Handles the actual navigation of units by incre/decrements of one <p>
 *
 * Used to provide functionality to next/prev Unit buttons <p>
 *
 * Updates currentDate, records date and view to history state, then loads the next Entry
 * (loadDay, loadMonth, loadYear) <p>
 *
 * Performs a toggleCheck afterwards to update index and entries (dayID[]) as well as
 * propertly disable prev/next buttons if navigation results in indexing to extremes (0 or length-1)
 *
 * @param {Number} amount - of Units to move (+/- 1)
 */
function navigateUnit (amount) {
  switch (history.state.view) {
    case 'day':
      currDate.setDate(currDate.getDate() + amount);
      window.history.pushState({ view: 'day', date: currDate }, 'Daily Log', '#day');
      loadDay();
      updateIndex();
      break;
    case 'month':
      currDate.setMonth(currDate.getMonth() + amount, 1);
      window.history.pushState({ view: 'month', date: currDate }, 'Monthly Log', '#month');
      loadMonth();
      break;
    case 'year':
      currDate.setFullYear(currDate.getFullYear() + amount);
      window.history.pushState({ view: 'year', date: currDate }, 'Yearly Log', '#year');
      loadYear();
      break;
  }
}

/**
 * Handles the navigation of entries by incre/decrements of one <p>
 *
 * Used to provide functionality to next/prev Entry buttons (only in daily view) <p>
 *
 * Relies on Unit movement being correctly disabled by the 'toggleCheck' function
 * to avoid moving beyond the bounds of entries (dayID[])
 * and to only allow Entry movement under the daily view <p>
 *
 * Uses index after navigation to load target Day's ID and set's current Date with an ID conversion <p>
 *
 * Records date and view to history state, then loads the next/prev Entry using the dayID retrieved from entries (dayID[]) <p>
 *
 * Performs a toggleCheck afterwards to update index and entries (dayID[]) as well as
 * propertly disable prev/next buttons if navigation results in indexing to extremes (0 or length-1)
 *
 * @param {Number} amount - of Entries to move (+/- 1)
 */
function navigateEntry (amount) {
  /* Generate the index to navigate to by either incrementing of decrementing by 1
   * - handle the case of traversing from right before end entry (index would be ON the last entry and attempt to move right)
   */
  index = index + amount;
  if (index >= entries.length) {
    // avoid index out of bounds retrieval attempts and crashes, do the checks against end first
    if (IDConverter.generateID('day', currDate) < entries[index - 1]) {
      index = entries.length - 1;
    }
  }
  const targetID = entries[index];
  currDate = IDConverter.getDateFromID(targetID, 'day');
  window.history.pushState({ view: 'day', date: currDate }, 'Daily Log', '#day');
  loadDay(targetID);
  updateIndex(targetID);
}
/* For quick commenting out of code */

/**
 * Performs updates to index and entries, then decides which buttons need to be disabled <p>
 *
 * A lookup is done on today's ID to determine index (using a binary search on entries since it's a sorted array),
 * if the day hasn't been recorded yet, the day object will handle deciding whether or not to add the day to entries <p>
 *
 * Calls function to toggle buttons based off updated Index and whether or not currentID is 'inBounds'
 * @param {string} [currID = IDConverter.generateID('day', currDate)] - current Day's ID used to update indexing and decide whether to toggle buttons
 */
function updateIndex (currID = IDConverter.generateID('day', currDate)) {
  // Generate the ID and determine index
  index = IDConverter.generateIndex(entries, currID);

  if (index === 0 && currID < entries[index]) {
    index -= 1;
  }

  // Boundedness is being between the start (index === 0) and end (entries >= entries[index])
  toggleCheck(index > 0 && currID < entries[index]);
}

/**
 * Handles additions to entries (dayID[]), which can occur in 2 ways: <p>
 *
 * - Insertion at end of array, which requires expansion of the array (checked first) <p>
 *
 * - Taking up an existing index and 'pushing' all other entries afterwards (using splice) <p>
 *
 * Otherwise, logs an error indicating function was called unnecsarilly
 */
export function updateEntries (currID = IDConverter.generateID('day', currDate), targetIndex) {
  if (targetIndex) {
    index = targetIndex;
  } else {
    index = IDConverter.generateIndex(entries, currID);
  }
  if (index === entries.length) {
    entries.push(currID);
  } else if (entries[index] !== currID) {
    entries.splice(index, 0, currID);
  } else {
    console.log(`updateEntries has already been called for ID ${currID} at index ${index}`);
  }
}
/* For quick commenting out of code */

/**
 * Toggles relavant Entry navigation buttons based on: <p>
 *
 * - Whether or not currently in daily view <p>
 *
 * - Whether or not index navigation in entries (dayID[]) would result in out of bounds
 *
 * @param {bool} inBounds - whether or not the current day is within the list
 * (to avoid disabling >> for days right before the last entry)
 */
function toggleCheck (inBounds = false) {
  // Either beginning or end of list indicates respective prev/next Entry toggling should be disabled
  if ((index <= 0 && !inBounds) || history.state.view !== 'day') {
    btnPrevEntry.disabled = true;
    btnPrevEntry.style.cursor = 'default';

    btnPrevEntry.style.backgroundColor = 'transparent';
  } else {
    btnPrevEntry.disabled = false;
    btnPrevEntry.style.cursor = 'pointer';
    btnPrevEntry.style.backgroundColor = '';
  }
  if ((index >= entries.length - 1 && !inBounds) || history.state.view !== 'day') {
    btnNextEntry.disabled = true;
    btnNextEntry.style.cursor = 'default';

    btnNextEntry.style.background = 'transparent';
  } else {
    btnNextEntry.disabled = false;
    btnNextEntry.style.cursor = 'pointer';
    btnNextEntry.style.backgroundColor = '';
  }
}

/* For quick commenting out of code */

/**
 * Provides functionality to calendar view in yearly/monthly logs <p>
 *
 * Access to contents (and therefor target date via ID) in the element that was triggered through event param <p>
 *
 * Converts stored ID to date with IDConverter and loads into currDate <p>
 *
 * Reads history state's current view to decide whether to transition to Monthly or Daily view,
 * then calls appropriate transition + load function (loadDay, loadMonth)
 *
 * @param {OnClickEvent} event - that triggered this function, provides access to target ID
 */
export function zoomIn (event) {
  switch (history.state.view) {
    case 'month':
      currDate = IDConverter.getDateFromID(event.target.id, 'day');
      window.history.pushState({ view: 'day', date: currDate }, 'Daily Log', '#day');
      loadDay();
      transitionDaily();
      updateIndex();
      break;
    case 'year':
      currDate = IDConverter.getDateFromID(event.target.id, 'month');
      window.history.pushState({ view: 'month', date: currDate }, 'Monthly Log', '#month');
      loadMonth();
      transitionMonthly();
      break;
  }
}

/* For quick commenting out of code */

// Notes and old code -------------------------------------------------------------------------------
/*
$(document).click(function(event) {
  var $target = $(event.target);
  if(!$target.closest('#menucontainer').length &&
  $('#menucontainer').is(":visible")) {
    $('#menucontainer').hide();
  }
});
*/
