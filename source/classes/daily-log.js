import { Database } from './database.js';

/**
 * This class contains functions to construct and edit the daily log custom HTML element.
 *
 * @classdesc
 * @example <caption>Daily Log class</caption>
 * // Example of a daily JSON object used to generate a daily-log element
 * const exampleDailyJSON = {
 *   widgets: [
 *     {
 *       id: '00'
 *       type: 'weather'
 *     }
 *   ],
 *   trackers: [
 *     {
 *       type: 'slider',
 *       name: 'Mood',
 *       value: 3
 *     },
 *     {
 *       type: 'slider',
 *       name: 'Sleep',
 *       value: 5
 *     },
 *     {
 *       type: 'checkbox',
 *       name: 'Workout',
 *       value: 1
 *     }
 *   ],
 *   sections: [
 *     {
 *       id: '00',
 *       name: 'Reminders',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 210515 00 00',
 *         'B 210515 00 01'
 *       ],
 *       nextBulNum: 2
 *     },
 *     {
 *       id: '01',
 *       name: 'Daily Notes',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 210515 01 00',
 *         'B 210515 01 01',
 *         'B 210515 01 02'
 *       ],
 *       nextBulNum: 3
 *     },
 *     {
 *       id: '02',
 *       name: 'Shopping List',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 210515 02 00',
 *         'B 210515 02 01'
 *       ],
 *       nextBulNum: 2
 *     },
 *     {
 *       id: '03',
 *       name: 'Daily Goals',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 210515 03 00',
 *         'B 210515 03 01'
 *       ],
 *       nextBulNum: 2
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

    this.nextSectionNum = 0;

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
   * @returns {Object} JSON representation of data used to generate this daily log element
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
            name: 'Reminders',
            type: 'log',
            bulletIDs: [],
            nextBulNum: 0
          },
          {
            id: '01',
            name: 'Daily Notes',
            type: 'log',
            bulletIDs: [],
            nextBulNum: 0
          }
        ]
      };
    }

    // get the shadow root of this custom HTML element and set its ID to the given ID
    const root = this.shadowRoot.querySelector('div.daily');
    root.id = id;

    // TODO: ADD EVENT LISTENERS TO HEADER BUTTONS HERE
    const newSectionButton = root.querySelector('#related-sections-button');
    newSectionButton.addEventListener('click', function (event) {
      dailyLog.newSectionHandler(event.target.closest('div.daily'));
    });

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
        const sectionID = section.id;

        // update next section number
        if (Number(section.id) >= this.nextSectionNum) {
          this.nextSectionNum = Number(section.id) + 1;
        }

        // construct section element
        const sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        sectionElement.className = section.type;

        // construct section header element
        const sectionHeader = document.createElement('h2');
        sectionHeader.innerText = section.name;
        sectionElement.appendChild(sectionHeader);

        // check if we are creating a custom section
        // (reminders section always has default section ID of '00')
        // (daily notes section always has default section ID of '01')
        if (sectionID !== '00' && sectionID !== '01') {
          // allow the user to change the section title
          sectionHeader.contentEditable = 'true';

          // add event listener to the header to update the daily log element when the header text is updated
          sectionHeader.addEventListener('blur', (event) => {
            const sectionName = dailyLog.data.sections.filter((section) => section.id === sectionID)[0].name;
            if (sectionHeader.innerText !== sectionName) {
              const dailyData = dailyLog.data;
              for (const sec of dailyData.sections) {
                if (sec.id === sectionID) {
                  sec.name = sectionHeader.innerText;
                }
              }
              this.setAttribute('data', JSON.stringify(dailyData));
              Database.store(id, dailyData);
            }
          });

          // add event listener to the header to prevent newlines in headers
          sectionHeader.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
              sectionHeader.blur();
            }
          });

          // create a button to delete the section and add the delete section event listener to it
          const deleteSectionButton = document.createElement('button');
          deleteSectionButton.className = 'delete-section';
          deleteSectionButton.innerText = 'Delete Section';
          deleteSectionButton.addEventListener('click', function (event) {
            dailyLog.deleteSectionHandler(sectionElement);
          });
          sectionElement.appendChild(deleteSectionButton);
        }

        // construct bullet elements
        for (const bulletID of section.bulletIDs) {
          // create bullet element and add the deletion event listeners to it
          const bulletElement = document.createElement('bullet-entry');
          bulletElement.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
            // condition check to determine if the listener was triggered when backspace was pressed on an empty note
            if (event.keyCode === 8 && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
              dailyLog.deleteNoteHandler(bulletElement);
            }
          });
          bulletElement.shadowRoot.querySelector('.bullet-remove').addEventListener('click', function (event) {
            dailyLog.deleteNoteHandler(bulletElement);
          });

          sectionElement.appendChild(bulletElement);

          // fetch the bullet data and set the bullet element's data in the callback
          Database.fetch(bulletID, function (bulletData, bulletID, bulletElement, sectionID) {
            dailyLog.setBulletData(bulletData, bulletID, bulletElement, sectionID);
          }, bulletID, bulletElement, sectionID);
        }

        // create a button to add new notes to the section and add the add new bullet event listener to it
        const newNoteButton = document.createElement('button');
        newNoteButton.className = 'new-bullet';
        newNoteButton.innerHTML = `
          <i class="fas fa-plus icon-size"></i>
        `;
        newNoteButton.addEventListener('click', function (event) {
          dailyLog.newNoteHandler(event.target.closest('section'));
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
   * data from the database or when we are creating a new bullet. The function first creates a
   * function that will be used by the created bullet object to update the bullet count in
   * the appropriate section of the daily log and generate a bullet ID for sub-bullets (nested
   * bullets that are children of this created bullet). The function then checks if the data
   * is not null or undefined. If the data isn't null/undefined, the bullet element's data is
   * set to the given data. If the data is null/undefined, the bullet element's data is set to
   * an empty JSON object, which creates a blank bullet.
   *
   * @param {Object} bulletData - The JSON object data that will be stored in the bullet
   * @param {string} bulletID - The string ID of the bullet object
   * @param {HTMLElement} bulletElement - The bullet-entry element whose data will be set
   * @param {string} sectionID - The string ID of the section in which the bullet is being created
   */
  setBulletData (bulletData, bulletID, bulletElement, sectionID) {
    const dailyLog = this;
    const newBulletID = function () {
      const newID = dailyLog.generateBulletID(sectionID);
      return newID;
    };

    if (bulletData) {
      bulletElement.data = [bulletID, bulletData, newBulletID];
    } else {
      bulletElement.data = [bulletID, {}, newBulletID];
    }
  }

  /**
   * This function is a helper function that is used to create a new bullet ID. The given section
   * ID determines which section the bullet is being created in. The function then combines the
   * bullet count for that section, the section ID, and the date of the daily object in which
   * the bullet is being added in order to create a new bullet ID, which is then returned.
   *
   * @param {string} sectionID - The string ID of the section in which the bullet is being created
   * @returns {string} The string ID to be used for the new bullet
   */
  generateBulletID (sectionID) {
    // get the data and find the section in which the bullet is being added to determine the new bullet number
    const data = this.data;
    let newBulNum;
    for (const section of data.sections) {
      if (section.id === sectionID) {
        newBulNum = section.nextBulNum;
        section.nextBulNum++;
      }
    }

    // store the udpated data
    this.setAttribute('data', JSON.stringify(data));
    Database.store(this.id, data);

    // generate the new bullet ID
    const bulletCount = this.stringifyNum(newBulNum);
    const dailyID = this.shadowRoot.querySelector('div.daily').id;

    return `B ${dailyID.substring(2)} ${sectionID} ${bulletCount}`;
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
   * @param {HTMLElement} sectionElement - The section element in which the new note button
   * was clicked to trigger the listener
   */
  newNoteHandler (sectionElement) {
    // generate a bullet ID
    const sectionID = sectionElement.id;
    const dailyID = this.shadowRoot.querySelector('div.daily').id;
    const bulletID = this.generateBulletID(sectionID);

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
    this.setBulletData({}, bulletID, bulletElement, sectionID);

    // add event listeners to the bullet element to handle bullet deletion
    const dailyLog = this;
    bulletElement.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
      // condition check to determine if the listener was triggered when backspace was pressed on an empty note
      if (event.keyCode === 8 && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
        dailyLog.deleteNoteHandler(bulletElement);
      }
    });
    bulletElement.shadowRoot.querySelector('.bullet-remove').addEventListener('click', function (event) {
      dailyLog.deleteNoteHandler(bulletElement);
    });

    // add the insert the new bullet element child before the new note button
    const newNoteButton = sectionElement.querySelector('button.new-bullet');
    sectionElement.insertBefore(bulletElement, newNoteButton);

    // prompt user to start typing note
    bulletElement.shadowRoot.querySelector('.bullet-text').focus();
  }

  /**
   * This function handles the deletion of a bullet. The function looks through the daily JSON
   * object to remove the ID of the bullet being deleted from the appropriate section, and then
   * stores the updated daily JSON object in the database and removes the bullet-entry HTML
   * element from the section.
   *
   * @param {HTMLElement} bulletElement - The bullet-entry element that is being deleted
   */
  deleteNoteHandler (bulletElement) {
    // get the section element that the bullet is a child of
    const section = bulletElement.closest('section');

    // loop through the daily JSON object to find the bullet ID to be deleted
    const sectionID = section.id;
    const data = this.data;
    for (const sec of data.sections) {
      // condition check to determine if this is the right section in the daily JSON object
      if (sec.id === sectionID) {
        sec.bulletIDs = sec.bulletIDs.filter((bulletID) => bulletID !== bulletElement.id);
      }
    }
    this.setAttribute('data', JSON.stringify(data));

    // store the updated daily JSON object in the database
    const dailyID = this.shadowRoot.querySelector('div.daily').id;
    Database.store(dailyID, data);

    // delete the bullet from the database
    Database.delete(bulletElement.id);

    // remove the bullet-entry HTML element from the section
    section.removeChild(bulletElement);
  }

  /**
   * This function creates a new section. It first creates a section ID by looking at how many
   * sections are currently in the daily log and adding 1. It then creates the new section
   * object for storage and adds it to the daily JSON object, then updates the daily JSON object
   * in the database. Lastly, it creates a new section HTML element, and adds the appropriate
   * buttons for note addition and section deletion, adds event listeners to those buttons, and
   * appends the section to the daily-log element.
   *
   * @param {HTMLElement} divElement - The daily-log div element in which the new section is
   * being created was clicked to trigger the listener
   */
  newSectionHandler (divElement) {
    const dailyLog = this;
    const dailyID = divElement.id;
    const sectionID = this.stringifyNum(this.nextSectionNum);
    this.nextSectionNum++;

    // create new section object
    const sectionObj = {
      id: sectionID,
      name: '',
      type: 'log',
      bulletIDs: [],
      nextBulNum: 0
    };

    // add section to the daily JSON object
    const data = this.data;
    data.sections.push(sectionObj);
    this.setAttribute('data', JSON.stringify(data));

    // store the updated daily JSON object in the database
    Database.store(dailyID, data);

    // create a blank section HTML element with the section ID
    const sectionElement = document.createElement('section');
    sectionElement.id = sectionObj.id;
    sectionElement.className = sectionObj.type;

    // create the editable section header element
    const sectionHeader = document.createElement('h2');
    sectionHeader.contentEditable = 'true';
    sectionElement.appendChild(sectionHeader);

    // add event listener to the header to update the daily log element when the header text is updated
    sectionHeader.addEventListener('blur', (event) => {
      const sectionName = dailyLog.data.sections.filter((section) => section.id === sectionID)[0].name;
      if (sectionHeader.innerText !== sectionName) {
        const dailyData = dailyLog.data;
        for (const sec of dailyData.sections) {
          if (sec.id === sectionID) {
            sec.name = sectionHeader.innerText;
          }
        }
        this.setAttribute('data', JSON.stringify(dailyData));
        Database.store(dailyID, dailyData);
      }
    });

    // add event listener to the header to prevent newlines in headers
    sectionHeader.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        sectionHeader.blur();
      }
    });

    // create a button to delete the section and add the delete section event listener to it
    const deleteSectionButton = document.createElement('button');
    deleteSectionButton.className = 'delete-section';
    deleteSectionButton.innerText = 'Delete Section';
    deleteSectionButton.addEventListener('click', function (event) {
      dailyLog.deleteSectionHandler(event.target.closest('section'));
    });
    sectionElement.appendChild(deleteSectionButton);

    // create a button to add new notes to the section and add the add new bullet event listener to it
    const newNoteButton = document.createElement('button');
    newNoteButton.className = 'new-bullet';
    newNoteButton.innerHTML = `
      <i class="fas fa-plus icon-size"></i>
    `;
    newNoteButton.addEventListener('click', function (event) {
      dailyLog.newNoteHandler(event.target.closest('section'));
    });
    sectionElement.appendChild(newNoteButton);

    divElement.appendChild(sectionElement);

    // prompt user to start typing section name
    sectionHeader.focus();
  }

  /**
   * This function handles the deletion of a section. The function looks through the daily JSON
   * object to remove the section object that is being deleted, and then stores the updated daily
   * JSON object in the database and removes the section HTML element from the daily log div.
   *
   * @param {HTMLElement} sectionElement - The section element that is being deleted
   */
  deleteSectionHandler (sectionElement) {
    // get the div element that the section is a child of
    const dailyDiv = this.shadowRoot.querySelector('div.daily');

    // delete the section object from the daily JSON object
    const sectionID = sectionElement.id;
    const data = this.data;
    data.sections = data.sections.filter((sec) => sec.id !== sectionID);
    this.setAttribute('data', JSON.stringify(data));

    // store the updated daily JSON object in the database
    const dailyID = dailyDiv.id;
    Database.store(dailyID, data);

    // remove the section HTML element from the daily div
    dailyDiv.removeChild(sectionElement);
  }

  // ------------------------------------- End Event Handlers -------------------------------------
} // end class DailyLog

// define a custom element for the DailyLog web component
customElements.define('daily-log', DailyLog);
