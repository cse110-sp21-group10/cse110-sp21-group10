import { Database } from '../classes/database.js';

/**
 * This class contains functions to construct and edit the yearly log custom HTML element.
 *
 * @classdesc
 * @example <caption>Yearly Log class</caption>
 * // Example of a yearly JSON object used to generate a yearly-log element
 * const exampleYearlyJSON = {
 *   sections: [
 *     {
 *       id: '00',
 *       name: 'Yearly Notes',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 21 00 00',
 *         'B 21 00 01'
 *       ]
 *     },
 *     {
 *       id: '01',
 *       name: 'Yearly Goals',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 21 00 02',
 *         'B 21 00 03'
 *       ]
 *     }
 *   ]
 * }
 * // Create a new yearly log HTML element using the object
 * let yearly = document.createElement('yearly-log');
 * yearly.data = exampleYearlyJSON;
 */

class YearlyLog extends HTMLElement {
  // -------------------------------------- Start Constructor -------------------------------------

  /**
   * Constructs a blank yearly log HTML element using the defined HTML template
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
      <div class="yearly">
        <section class="header" id="yearly-header">
          <h1></h1>
          <button class="main-buttons" id="related-sections-button"><i class="fas fa-plus icon-size"></i></button>
        </section>
        <section id="yearly-calendar"></section>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // --------------------------------------- End Constructor --------------------------------------

  // ---------------------------------- Start Get/Set Functions -----------------------------------

  /**
   * This function returns the data stored in this yearly element as a JSON object.
   *
   * @returns {Object} JSON representation of data used to generate this yearly log element
   */
  get data () {
    return JSON.parse(this.getAttribute('data'));
  }

  /**
   * This function constructs the yearly log HTML element using the given ID and yearly log
   * object data. It starts by constructing and setting the header text for the element, then
   * goes through each attribute of the yearly log object to construct the notes sections of
   * the element. Each notes section is constructed by fetching the data of each bullet in the
   * section from the database, and creating a custom bullet-entry HTML element that is appended
   * to the section. Finally, the setAttribute function is called on this element to set the
   * 'data' attribute of the element to be the given JSON data, so that the data can be retrieved
   * from the element later if needed.
   *
   * @param {Array.<{id: string, jsonData: Object}>} data - Array of two elements (first element
   * is the string ID of the object, and the second element is the JSON object data) that is used
   * to construct and set the data in this HTML element
   */
  set data ([id, jsonData]) {
    // store this object in a variable so it can be passed to handlers later
    const yearlyLog = this;

    // set the id of the custon element to the given id
    this.id = id;

    // if the jsonData is an empty object, then we should create an empty yearly element
    if (Object.entries(jsonData).length === 0) {
      jsonData = {
        sections: [
          {
            id: '00',
            name: 'Yearly Notes',
            type: 'log',
            bulletIDs: []
          },
          {
            id: '01',
            name: 'Yearly Goals',
            type: 'checklist',
            bulletIDs: []
          }
        ]
      };
      Database.store(id, jsonData);
    }

    // get the shadow root of this custom HTML element and set its ID to the given ID
    const root = this.shadowRoot.querySelector('.yearly');
    root.id = id;

    // TODO: ADD EVENT LISTENERS TO HEADER BUTTONS HERE

    // get all information about the date that is needed for the header display
    const dateObj = this.getDateFromID(id);
    const year = dateObj.getFullYear();
    const dateString = `${year}`;

    // get the header text of this custom HTML element and set its contents to the constructed date string
    const headerText = root.querySelector('#yearly-header > h1');
    headerText.innerText = dateString;

    const calendar = root.querySelector('#yearly-calendar');
    for (let i = 0; i < 12; i++) {
      const monthButton = document.createElement('button');
      monthButton.className = 'yearly-calendar-button';
      const idYear = this.stringifyNum(year % 100);
      const idMonth = this.stringifyNum(i + 1);
      monthButton.id = `M ${idYear}${idMonth}`;
      monthButton.innerText = String(this.getMonthFromDate(new Date(year, i)));
      calendar.appendChild(monthButton);
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
          bulletElement.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
            yearlyLog.deleteNoteHandler(event, bulletElement);
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
        newNoteButton.addEventListener('click', function (event) {
          yearlyLog.newNoteHandler(event);
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
   * parses the given ID to determine the year, and returns a corresponding Date object.
   *
   * @param {string} id - The yearly ID (with the format 'Y YY') to parse
   * @returns {Date} a Date object representing the date determined by the ID
   */
  getDateFromID (id) {
    // parse year
    const year = Number(id.substring(2, 4)) + 2000;

    return new Date(year, 0, 1);
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
   * the yearly log to which the bullet will belong, the ID of the section to which the bullet
   * is being added, and the ID of the new bullet, which is determined based on the number of
   * bullets currently in the section. It then adds the bullet ID to the yearly JSON object in
   * the appropriate section, and stores the updated yearly JSON object in the database. Lastly,
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
    const yearlyID = this.shadowRoot.querySelector('div.yearly').id;
    const date = this.getDateFromID(yearlyID);
    const year = this.stringifyNum(date.getFullYear() % 100);
    const bulletID = `B ${year} ${sectionID} ${bulletCount}`;

    // increment the number of bullets in the section
    this.bulletCounts[Number(sectionID)]++;

    // add bullet ID to the yearly JSON object bulletIDs in the right section
    const data = this.data;
    for (const sec of data.sections) {
      if (sec.id === sectionID) {
        sec.bulletIDs.push(bulletID);
      }
    }
    this.setAttribute('data', JSON.stringify(data));

    // store the updated yearly JSON object in the database
    Database.store(yearlyID, data);

    // create a blank bullet HTML element with the generated ID
    const bulletElement = document.createElement('bullet-entry');
    this.setBulletData({}, bulletID, bulletElement);

    // add event listener to the bullet element to handle bullet deletion
    const yearlyLog = this;
    bulletElement.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
      yearlyLog.deleteNoteHandler(event, bulletElement);
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
   * for deletion is met, the function looks through the yearly JSON object to remove the ID of
   * the bullet being deleted from the appropriate section, and then stores the updated yearly
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

      // loop through the yearly JSON object to find the bullet ID to be deleted
      const sectionID = section.id;
      const data = this.data;
      for (const sec of data.sections) {
        // condition check to determine if this is the right section in the yearly JSON object
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

      // store the updated yearly JSON object in the database
      const yearlyID = this.shadowRoot.querySelector('div.yearly').id;
      Database.store(yearlyID, data);

      // delete the bullet from the database
      Database.delete(element.id);

      // remove the bullet-entry HTML element from the section
      section.removeChild(element);
    }
  }

  // ------------------------------------- End Event Handlers -------------------------------------
} // end class YearlyLog

// define a custom element for the YearlyLog web component
customElements.define('yearly-log', YearlyLog);
