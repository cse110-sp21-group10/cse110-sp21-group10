import { Database } from '../classes/database.js';

/**
 * This class contains functions to construct and edit the daily log custom HTML element.
 *
 * @classdesc
 * @example <caption>Daily Log class</caption>
 * // Example of a daily JSON object used to generate a daily-log element
 * const exampleDailyJSON = {
 *   widgets: [
 *     {
 *       id: '00',
 *       type: 'reminder',
 *       bulletIDs: [
 *         'B 210515 00 00',
 *         'B 210515 00 01'
 *       ]
 *     },
 *     {
 *       id: '01'
 *       type: 'weather'
 *     }
 *   ],
 *   trackers: [
 *     {
 *       type: 'slider',
 *       name: mood,
 *       value: 3
 *     },
 *     {
 *       type: 'checkbox',
 *       name: 'Meditate',
 *       value: 0
 *     },
 *     {
 *       type: 'checkbox',
 *       name: 'Work out',
 *       value: 1
 *     }
 *   ],
 *   sections: [
 *     {
 *       id: '00',
 *       name: 'Daily Notes',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 210515 00 00',
 *         'B 210515 00 01'
 *       ]
 *     },
 *     {
 *       id: '03',
 *       name: 'Shopping List',
 *       type: 'checklist',
 *       bulletIDs: [
 *         'B 210515 01 00',
 *         'B 210515 01 01'
 *       ]
 *     },
 *     {
 *       id: '04',
 *       name: 'Daily Goals',
 *       type: 'checklist',
 *       bulletIDs: [
 *         'B 210515 02 00',
 *         'B 210515 02 01'
 *       ]
 *     }
 *   ]
 * }
 * // Create a new daily log HTML element using the object
 * let daily = document.createElement('daily-log');
 * daily.data = exampleDailyJSON;
 */

class DailyLog extends HTMLElement {
  // -------------------------------------- Start Constructor -------------------------------------

  /**
   * Constructs a blank daily log HTML element using the defined HTML template
   *
   * @constructor
   */
  constructor () {
    super();

    this.bulletCounts = [];

    const template = document.createElement('template');

    template.innerHTML = `
      <link rel="stylesheet" href="../style/style.css">
      <link rel="stylesheet" href="../assets/css/all.css">
      <div class="daily">
        <section class="header" id="daily-header">
          <h1></h1>
          <button class="main-buttons" id="weather-icon"><i class="fas fa-cloud-sun icon-size"></i></button>
          <button class="main-buttons" id="widgets"><i class="fas fa-star icon-size"></i></button>
          <button class="main-buttons" id="related-sections-button"><i class="fas fa-plus icon-size"></i></button>
        </section>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // --------------------------------------- End Constructor --------------------------------------

  // ---------------------------------- Start Get/Set Functions -----------------------------------

  /**
   * This function returns the data stored in this daily element as a JSON object.
   *
   * @returns {string} JSON representation of data used to generate this daily log element
   */
  get data () {
    return JSON.parse(this.getAttribute('data'));
  }

  /**
   * This function constructs the daily log HTML element using the given ID and daily log
   * object data. It starts by constructing and setting the header text for the element, then
   * goes through each attribute of the daily log object to construct the widgets, trackers, and
   * notes sections of the element. Each notes section is constructed by fetching the data of
   * each bullet in the section from the database, and creating a custom bullet-entry HTML
   * element that is appended to the section. Finally, the setAttribute function is called
   * on this element to set the 'data' attribute of the element to be the given JSON data,
   * so that the data can be retrieved from the element later if needed.
   *
   * @param {Array.<{id: string, jsonData: Object}>} data - Array of two elements (first element
   * is the string ID of the object, and the second element is the JSON object data) that is used
   * to construct and set the data in this HTML element
   */
  set data ([id, jsonData]) {
    // store this object in a variable so it can be passed to handlers later
    const dailyLog = this;

    // set the id of the custon element to the given id
    this.id = id;

    // if the jsonData is an empty object, then we should create an empty daily element
    if (Object.entries(jsonData).length === 0) {
      jsonData = {
        widgets: [],
        trackers: [],
        sections: [
          {
            id: '00',
            name: 'Daily Notes',
            type: 'log',
            bulletIDs: []
          }
        ]
      };
      Database.store(id, jsonData);
    }

    // get the shadow root of this custom HTML element and set its ID to the given ID
    const root = this.shadowRoot.querySelector('.daily');
    root.id = id;

    // TODO: ADD EVENT LISTENERS TO HEADER BUTTONS HERE

    // get all information about the date that is needed for the header display
    const dateObj = this.getDateFromID(id);
    const day = this.getDayFromDate(dateObj);
    const month = this.getMonthFromDate(dateObj);
    const date = dateObj.getDate();
    const suffix = this.getSuffixOfDate(dateObj);
    const dateString = `${day}, ${month} ${date}${suffix}`;

    // get the header text of this custom HTML element and set its contents to the constructed date string
    const headerText = root.querySelector('#daily-header > h1');
    headerText.innerText = dateString;

    // creates all widgets in one section
    if (jsonData.widgets && jsonData.widgets.length > 0) {
      const widgetSection = document.createElement('section');
      widgetSection.className = 'widgets';
      widgetSection.innerHTML = `
        <h2>Widgets</h2>
        <button class="add" id="add-widget">Add Widget</button >
        <button class="minimize" id="minimize-widgets">Minimize Widgets</button>
      `;

      for (const widget of jsonData.widgets) {
        console.log(widget);
        // TODO: CONSTRUCT THE WIDGET HERE
      }

      root.appendChild(widgetSection);
    }

    // creates all trackers in one section
    if (jsonData.trackers && jsonData.trackers.length > 0) {
      const trackerSection = document.createElement('section');
      trackerSection.className = 'trackers';
      trackerSection.innerHTML = `
        <h2>Trackers</h2>
        <button class="add" id="add-tracker">Add Tracker</button >
        <button class="minimize" id="minimize-trackers">Minimize Trackers</button>
      `;

      for (const tracker of jsonData.trackers) {
        console.log(tracker);
        // TODO: CONSTRUCT THE TRACKER HERE
      }

      root.appendChild(trackerSection);
    }

    // loop through all sections in JSON data and construct and populate them
    if (jsonData.sections) {
      for (const section of jsonData.sections) {
        const sectionID = Number(section.id);
        let bulletCount = 0;

        // construct section element
        const sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        sectionElement.className = section.type;

        // construct section header element
        const sectionHeader = document.createElement('h2');
        sectionHeader.innerText = section.name;
        sectionElement.appendChild(sectionHeader);

        // construct bullet elements
        for (const bulletID of section.bulletIDs) {
          // increment the number of bullets in the section
          bulletCount++;

          // create bullet element and add the deletion event listener to it
          const bulletElement = document.createElement('bullet-entry');
          const deleteHandler = this.deleteNoteHandler;
          bulletElement.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
            deleteHandler.call(dailyLog, event, bulletElement);
          });
          sectionElement.appendChild(bulletElement);

          // fetch the bullet data and set the bullet element's data in the callback
          Database.fetch(bulletID, this.setBulletData, bulletID, bulletElement);
        }

        // set the number of bullets in this section
        this.bulletCounts[sectionID] = bulletCount;

        // create a button to add new notes to the section and add the add new bullet event listener to it
        const newNoteButton = document.createElement('button');
        newNoteButton.className = 'new-bullet';
        newNoteButton.innerHTML = `
          <i class="fas fa-plus icon-size"></i>
        `;
        const addHandler = this.newNoteHandler;
        newNoteButton.addEventListener('click', function (event) {
          addHandler.call(dailyLog, event);
        });
        sectionElement.appendChild(newNoteButton);

        root.appendChild(sectionElement);
      }
    }

    // set the data attribute of this element to the given JSON data so it can be retrieved later
    this.setAttribute('data', JSON.stringify(jsonData));
  }

  // ----------------------------------- End Get/Set Functions ------------------------------------

  // ----------------------------------- Start Helper Functions -----------------------------------

  /**
   * This function is a helper function that is used to determine the date for a given ID. The function
   * parses the given ID to determine the year, month, and date, and returns a corresponding Date object.
   *
   * @param {string} id - The daily ID (with the format 'D YYMMDD') to parse
   * @returns {Date} a Date object representing the date determined by the ID
   */
  getDateFromID (id) {
    // parse year, month, date
    const year = Number(id.substring(2, 4)) + 2000;
    const month = Number(id.substring(4, 6)) - 1;
    const date = Number(id.substring(6, 8));

    return new Date(year, month, date);
  }

  /**
   * This function is a helper function that is used to determine the day of the week for a given date.
   * The function takes a Date object, then retrieves and converts the day-of-week integer representation
   * into the corresponding string (English) format.
   *
   * @param {Date} dateObj - The Date object from which to retrieve day-of-week
   * @returns {string} The day of the week, as a string
   */
  getDayFromDate (dateObj) {
    const dayIndex = dateObj.getDay();
    // convert 0-6 to Sunday-Saturday
    switch (dayIndex) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
    }
  }

  /**
   * This function is a helper function that is used to determine the month for a given date.
   * The function takes a Date object, then retrieves and converts the month integer
   * representation into the corresponding string (English) format.
   *
   * @param {Date} dateObj - The Date object from which to retrieve month
   * @returns {string} The month, as a string
   */
  getMonthFromDate (dateObj) {
    const monthIndex = dateObj.getMonth();
    // convert 0-11 to January-December
    switch (monthIndex) {
      case 0:
        return 'January';
      case 1:
        return 'February';
      case 2:
        return 'March';
      case 3:
        return 'April';
      case 4:
        return 'May';
      case 5:
        return 'June';
      case 6:
        return 'July';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'October';
      case 10:
        return 'November';
      case 11:
        return 'December';
    }
  }

  /**
   * This function is a helper function that is used to determine the suffix for a given
   * date based on how it would be read. The function takes a Date object, then retrieves
   * the date integer and determines the suffix for the date integer that should be
   * displayed. <p>
   *
   * date integer ending in 1 -> suffix 'st' <p>
   * date integer ending in 2 -> suffix 'nd' <p>
   * date integer ending in 3 -> suffix 'rd' <p>
   * date integer ending in 0 or 4-9 -> suffix 'th' <p>
   * special cases: date integers 11, 12, and 13 -> suffix 'th'
   *
   * @param {Date} dateObj - The Date object from which to retrieve the date and determine its suffix
   * @returns {string} The suffix ('st', 'nd', 'rd', 'th') corresponding to the date integer
   */
  getSuffixOfDate (dateObj) {
    const date = dateObj.getDate();

    // possible suffixes
    const ST = 'st';
    const ND = 'nd';
    const RD = 'rd';
    const TH = 'th';

    /*
      11, 12, 13 are special 'th'
      for all other ones digits:
      1 -> 'st'
      2 -> 'nd'
      3 -> 'rd'
      0, 4-9 -> 'th'
      (no need to address any number greater than 31 because there are at most 31 days in a month)
    */
    if (date === 11 || date === 12 || date === 13) {
      return TH;
    } else if (date % 10 === 1) {
      return ST;
    } else if (date % 10 === 2) {
      return ND;
    } else if (date % 10 === 3) {
      return RD;
    } else {
      return TH;
    }
  }

  /**
   * This function is a helper function that is used as the callback for when we fetch bullet
   * data from the database. The function checks if the data is not null or undefined. If the
   * data isn't null/undefined, the bullet element's data is set to the given data. If the data
   * is null/undefined, the bullet element's data is set to an empty JSON object, which creates
   * a blank bullet.
   *
   * @param {Object} bulletData - the JSON object data that will be stored in the bullet
   * @param {string} bulletID - the string ID of the bullet object
   * @param {HTMLElement} bulletElement - the bullet-entry element whose data will be set
   */
  setBulletData (bulletData, bulletID, bulletElement) {
    if (bulletData) {
      bulletElement.data = [bulletID, bulletData];
    } else {
      bulletElement.data = [bulletID, {}];
    }
  }

  /**
   * This function is a helper function to convert an ID number into the right string format.
   * IDs for our objects are stored as strings, and if the number is less than 10, the string
   * representation we use has a 0 in front of the number. For example a section number 1 would
   * have an ID of '01'.
   *
   * @param {number} num - the integer that is being stringified
   * @returns {string} a string representation of the number that can be used in object IDs
   */
  stringifyNum (num) {
    if (num < 10) {
      return `0${num}`;
    }
    return `${num}`;
  }

  // ------------------------------------ End Helper Functions ------------------------------------

  // ------------------------------------ Start Event Handlers ------------------------------------

  /**
   * This function creates a new bullet. It first generates a bullet ID by combining the date of
   * the daily log to which the bullet will belong, the ID of the section to which the bullet
   * is being added, and the ID of the new bullet, which is determined based on the number of
   * bullets currently in the section. It then adds the bullet ID to the daily JSON object in
   * the appropriate section, and stores the updated daily JSON object in the database. Lastly,
   * it creates a new bullet-entry HTML element, and adds the appropriate event listener to it
   * to allow for future deletion of the bullet element.
   *
   * @param {Event} event - the click event that triggered the listener; it contains information
   * about the target of the event, which can be used to figure out which section the bullet
   * is being added to
   */
  newNoteHandler (event) {
    // generate a bullet ID
    const section = event.target.closest('section');
    const sectionID = section.id;
    const bulletCount = this.stringifyNum(this.bulletCounts[Number(sectionID)]);
    const dailyID = this.shadowRoot.querySelector('div.daily').id;
    const date = this.getDateFromID(dailyID);
    const year = this.stringifyNum(date.getYear() % 100);
    const month = this.stringifyNum(date.getMonth() + 1);
    const day = this.stringifyNum(date.getDate());
    const bulletID = `B ${year}${month}${day} ${sectionID} ${bulletCount}`;

    // increment the number of bullets in the section
    this.bulletCounts[Number(sectionID)]++;

    // add bullet ID to the daily JSON object bulletIDs in the right section
    const data = this.data;
    for (const sec of data.sections) {
      if (sec.id === sectionID) {
        sec.bulletIDs.push(bulletID);
      }
    }
    this.setAttribute('data', JSON.stringify(data));

    // store the updated daily JSON object in the database
    Database.store(dailyID, data);

    // create a blank bullet HTML element with the generated ID
    const bulletElement = document.createElement('bullet-entry');
    this.setBulletData({}, bulletID, bulletElement);

    // add event listener to the bullet element to handle bullet deletion
    const dailyLog = this;
    const deleteHandler = this.deleteNoteHandler;
    bulletElement.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
      deleteHandler.call(dailyLog, event, bulletElement);
    });

    // add the insert the new bullet element child before the new note button
    const newNoteButton = section.querySelector('button.new-bullet');
    section.insertBefore(bulletElement, newNoteButton);

    // prompt user to start typing note
    bulletElement.shadowRoot.querySelector('.bullet-text').focus();
  }

  /**
   * This function handles the deletion of a bullet. It first checks if the event that triggered
   * the listener is one such that the backspace button was clicked on a bullet with no text,
   * because that is how we decided we want the user to be able to delete notes. If the condition
   * for deletion is met, the function looks through the daily JSON object to remove the ID of
   * the bullet being deleted from the appropriate section, and then stores the updated daily
   * JSON object in the database and removes the bullet-entry HTML element from the section.
   *
   * @param {Event} event - the click event that triggered the listener; it contains information
   * about the target of the event, which can be used to figure out which section the bullet
   * is being deleted from
   * @param {HTMLElement} element - the bullet-entry element that is being deleted
   */
  deleteNoteHandler (event, element) {
    // condition check to determine if the listener was triggered when backspace was pressed on an empty note
    if (event.keyCode === 8 && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
      // get the section element that the bullet is a child of
      const section = element.closest('section');

      // loop through the daily JSON object to find the bullet ID to be deleted
      const sectionID = section.id;
      const data = this.data;
      for (const sec of data.sections) {
        // condition check to determine if this is the right section in the daily JSON object
        if (sec.id === sectionID) {
          // loop through the bullet ID's of the section to find the one for deletion
          for (let i = 0; i < sec.bulletIDs.length; i++) {
            if (sec.bulletIDs[i] === element.id) {
              sec.bulletIDs.splice(i, 1);
            }
          }
        }
      }
      this.setAttribute('data', JSON.stringify(data));

      // store the updated daily JSON object in the database
      const dailyID = this.shadowRoot.querySelector('div.daily').id;
      Database.store(dailyID, data);

      // delete the bullet from the database
      Database.delete(element.id);

      // remove the bullet-entry HTML element from the section
      section.removeChild(element);
    }
  }

  // ------------------------------------- End Event Handlers -------------------------------------
} // end class DailyLog

// define a custom element for the DailyLog web component
customElements.define('daily-log', DailyLog);
