import { Database } from '../classes/database.js';
import { IDConverter } from './IDConverter.js';

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
 *       name: 'Yearly Goals',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 21 00 00',
 *         'B 21 00 01'
 *       ],
 *       nextBulNum: 2
 *     },
 *     {
 *       id: '01',
 *       name: 'Yearly Notes',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 21 01 00',
 *         'B 21 01 01',
 *         'B 21 01 02'
 *       ],
 *       nextBulNum: 3
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

    const template = document.createElement('template');

    template.innerHTML = `
      <link rel="stylesheet" href="../style/style.css">
      <link rel="stylesheet" href="../assets/css/all.css">
      <div class="yearly">
        <section class="header" id="yearly-header">
          <h1></h1>
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
   * @param {Array.<{id: string, jsonData: Object, callback: function}>} data - Array of three
   * elements (first element is the string ID of the object, second element is the JSON object
   * data, and the third element is the callback function for zooming into a certain date) that is
   * used to construct and set the data in this HTML element
   */
  set data ([id, jsonData, callback]) {
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
            name: 'Yearly Goals',
            type: 'log',
            bulletIDs: [],
            nextBulNum: 0
          },
          {
            id: '01',
            name: 'Yearly Notes',
            type: 'log',
            bulletIDs: [],
            nextBulNum: 0
          }
        ]
      };
    }

    // get the shadow root of this custom HTML element and set its ID to the given ID
    const root = this.shadowRoot.querySelector('div.yearly');
    root.id = id;

    // get all information about the date that is needed for the header display
    const dateObj = IDConverter.getDateFromID(id, 'year');
    const year = dateObj.getFullYear();
    const dateString = `${year}`;

    // get the header text of this custom HTML element and set its contents to the constructed date string
    const headerText = root.querySelector('#yearly-header > h1');
    headerText.innerText = dateString;

    // create buttons for each month in the yearly calendar
    const calendar = root.querySelector('#yearly-calendar');
    for (let i = 0; i <= 11; i++) {
      const monthButton = document.createElement('button');
      monthButton.className = 'yearly-calendar-button';
      monthButton.id = `M ${id.substring(2)}${IDConverter.stringifyNum(i + 1)}`;
      monthButton.innerText = String(IDConverter.getMonthFromDate(new Date(year, i))).substring(0,3);
      monthButton.addEventListener('click', function (event) {
        callback(event);
      });
      calendar.appendChild(monthButton);
    }

    // loop through all sections in JSON data and construct and populate them
    if (jsonData.sections) {
      for (const section of jsonData.sections) {
        const sectionID = section.id;

        // construct section element
        const sectionElement = document.createElement('section');
        sectionElement.id = section.id;
        sectionElement.className = section.type;

        // added a margin to the bottom of each section
        sectionElement.style = 'margin-bottom: 1vw';

        // construct section header element
        const sectionHeader = document.createElement('h2');
        sectionHeader.innerText = section.name;
        sectionElement.appendChild(sectionHeader);

        // construct bullet elements
        for (const bulletID of section.bulletIDs) {
          // create bullet element and add the deletion event listeners to it
          const bulletElement = document.createElement('bullet-entry');
          bulletElement.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
            // condition check to determine if the listener was triggered when backspace was pressed on an empty note
            if (event.keyCode === 8 && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
              yearlyLog.deleteNoteHandler(bulletElement);
            }
          });
          bulletElement.shadowRoot.querySelector('.bullet-remove').addEventListener('click', function (event) {
            yearlyLog.deleteNoteHandler(bulletElement);
          });

          sectionElement.appendChild(bulletElement);

          // fetch the bullet data and set the bullet element's data in the callback
          Database.fetch(bulletID, function (bulletData, bulletID, bulletElement, sectionID) {
            yearlyLog.setBulletData(bulletData, bulletID, bulletElement, sectionID);
          }, bulletID, bulletElement, sectionID);
        }

        // create a button to add new notes to the section and add the add new bullet event listener to it
        const newNoteButton = document.createElement('button');
        newNoteButton.className = 'new-bullet';
        newNoteButton.innerHTML = `
          <i class="fas fa-plus"></i>
        `;
        newNoteButton.addEventListener('click', function (event) {
          yearlyLog.newNoteHandler(event.target.closest('section'));
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
   * This function is a helper function that is used as the callback for when we fetch bullet
   * data from the database or when we are creating a new bullet. The function first creates a
   * function that will be used by the created bullet object to update the bullet count in
   * the appropriate section of the yearly log and generate a bullet ID for sub-bullets (nested
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
    const yearlyLog = this;
    const newBulletID = function () {
      const newID = yearlyLog.generateBulletID(sectionID);
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
   * bullet count for that section, the section ID, and the date of the yearly object in which
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
    const bulletCount = IDConverter.stringifyNum(newBulNum);
    const yearlyID = this.shadowRoot.querySelector('div.yearly').id;

    return `B ${yearlyID.substring(2)} ${sectionID} ${bulletCount}`;
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
   * @param {HTMLElement} sectionElement - The section element in which the new note button
   * was clicked to trigger the listener
   */
  newNoteHandler (sectionElement) {
    // generate a bullet ID
    const sectionID = sectionElement.id;
    const yearlyID = this.shadowRoot.querySelector('div.yearly').id;
    const bulletID = this.generateBulletID(sectionID);

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

    // create a blank bullet element with the generated ID
    const bullet = document.createElement('bullet-entry');
    this.setBulletData({}, bulletID, bullet, sectionID);

    // add event listener to the bullet element to handle deletion
    const yearlyLog = this;
    bullet.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
      // condition check to determine if backspace was pressed on an empty note
      if (event.keyCode === 8 && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
        yearlyLog.deleteNoteHandler(bullet);
      }
    });
    bullet.shadowRoot.querySelector('.bullet-remove').addEventListener('click', function (event) {
      yearlyLog.deleteNoteHandler(bullet);
    });

    // insert the new bullet element child before the new note button
    const newNote = sectionElement.querySelector('button.new-bullet');
    sectionElement.insertBefore(bullet, newNote);

    // prompt user to start typing note
    bullet.shadowRoot.querySelector('.bullet-text').focus();
  }

  /**
   * This function handles the deletion of a bullet. The function looks through the yearly JSON
   * object to remove the ID of the bullet being deleted from the appropriate section, and then
   * stores the updated yearly JSON object in the database and removes the bullet-entry HTML
   * element from the section.
   *
   * @param {HTMLElement} bulletElement - The bullet-entry element that is being deleted
   */
  deleteNoteHandler (bulletElement) {
    // get the section element that the bullet is a child of
    const section = bulletElement.closest('section');

    // loop through the yearly JSON object to find the bullet ID to be deleted
    const sectionID = section.id;
    const data = this.data;
    for (const sec of data.sections) {
      // condition check to determine if this is the right section in the yearly JSON object
      if (sec.id === sectionID) {
        sec.bulletIDs = sec.bulletIDs.filter((bulletID) => bulletID !== bulletElement.id);
      }
    }
    this.setAttribute('data', JSON.stringify(data));

    // store the updated yearly JSON object in the database
    const yearlyID = this.shadowRoot.querySelector('div.yearly').id;
    Database.store(yearlyID, data);

    // delete the bullet from the database
    Database.delete(bulletElement.id);

    // remove the bullet-entry HTML element from the section
    section.removeChild(bulletElement);
  }

  // ------------------------------------- End Event Handlers -------------------------------------
} // end class YearlyLog

// define a custom element for the YearlyLog web component
customElements.define('yearly-log', YearlyLog);
