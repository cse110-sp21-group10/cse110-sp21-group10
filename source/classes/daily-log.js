import { Database } from '../classes/database.js';

/**
 * This class contains a constructor, edit, and remove functions for the daily log custom HTML element
 * @classdesc
 * @example <caption>Daily Log class</caption>
 * // Example of a daily JSON object used to generate a daily-log element
 * const exampleDailyJSON = {
 *   widgets: [
 *     {
 *       type: 'reminder',
 *       bulletIDs: [
 *         'B 210515 00 00',
 *         'B 210515 00 01'
 *       ]
 *     },
 *     {
 *       "type": "weather"
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
 *       name: 'Daily Notes',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 210515 01 00',
 *         'B 210515 01 01'
 *       ]
 *     },
 *     {
 *       name: 'Shopping List',
 *       type: 'checklist',
 *       bulletIDs: [
 *         'B 210515 02 00',
 *         'B 210515 02 01'
 *       ]
 *     },
 *     {
 *       name: 'Daily Goals',
 *       type: 'checklist',
 *       bulletIDs: [
 *         'B 210515 03 00',
 *         'B 210515 03 01'
 *       ]
 *     }
 *   ]
 * }
 * // Create a new daily log HTML element using the object
 * let daily = document.createElement('daily-log');
 * daily.data = exampleDailyJSON;
 */

class DailyLog extends HTMLElement {
/**
 * Constructs a blank daily log HTML element using the defined HTML template
 *
 * @constructor
 */
  constructor () {
    super();

    const template = document.createElement('template');

    template.innerHTML = `
      <link rel="stylesheet" href="../style/style.css">
      <link rel="stylesheet" href="../css/all.css">
      <div class="daily">
        <section class="header" id="daily-header">
          <h1 id="date"></h1>
          <button class="main-buttons" id="weather-icon">
            <svg width="61" height="49" viewBox="0 0 61 49" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M54.9062 30.5625C54.9062 30.375 55 30.1875 55 30.0938C55 26.7188 52.2812 24.0938 49 24.0938C47.7812 24.0938 46.6562 24.375 45.7188 25.0312C44.125 21.375 40.4688 18.8438 36.25 18.8438C30.4375 18.8438 25.75 23.5312 25.75 29.3438C25.75 29.625 25.75 29.8125 25.75 30.0938C21.1562 30.4688 17.5 34.3125 17.5 39.0938C17.5 44.0625 21.5312 48.0938 26.5 48.0938H52C56.9688 48.0938 61 44.0625 61 39.0938C61 35.0625 58.375 31.7812 54.9062 30.5625ZM14.5 28.5C10.4688 24.375 10.4688 17.7188 14.5 13.5938C18.625 9.5625 25.2812 9.5625 29.4062 13.5938C30.25 14.5312 31 15.5625 31.4688 16.6875C32.4062 16.3125 33.3438 16.125 34.375 15.9375L37.1875 7.6875C37.5625 6.5625 36.4375 5.4375 35.3125 5.8125L27.1562 8.625L23.2188 0.84375C22.75 -0.1875 21.25 -0.1875 20.6875 0.84375L16.8438 8.625L8.59375 5.8125C7.46875 5.4375 6.4375 6.5625 6.71875 7.6875L9.53125 15.8438L1.75 19.7812C0.71875 20.25 0.71875 21.75 1.75 22.3125L9.53125 26.1562L6.71875 34.4062C6.34375 35.5312 7.46875 36.5625 8.59375 36.1875L15.7188 33.8438C16.2812 32.7188 17.0312 31.5938 17.875 30.75C16.6562 30.1875 15.5312 29.4375 14.5 28.5ZM14.125 21C14.125 24.8438 16.8438 28.0312 20.4062 28.7812C21.1562 28.3125 22 27.9375 22.8438 27.6562C23.3125 23.5312 25.75 19.875 29.125 17.8125C27.9062 15.0938 25.1875 13.125 22 13.125C17.5938 13.125 14.125 16.6875 14.125 21Z" fill="black"/>
            </svg>
          </button>
          <button class="main-buttons" id="widgets">
            <svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 0.5C1.96875 0.5 0 2.5625 0 5C0 7.53125 1.96875 9.5 4.5 9.5C6.9375 9.5 9 7.53125 9 5C9 2.5625 6.9375 0.5 4.5 0.5ZM4.5 15.5C1.96875 15.5 0 17.5625 0 20C0 22.5312 1.96875 24.5 4.5 24.5C6.9375 24.5 9 22.5312 9 20C9 17.5625 6.9375 15.5 4.5 15.5ZM4.5 30.5C1.96875 30.5 0 32.5625 0 35C0 37.5312 1.96875 39.5 4.5 39.5C6.9375 39.5 9 37.5312 9 35C9 32.5625 6.9375 30.5 4.5 30.5ZM46.5 32H16.5C15.6562 32 15 32.75 15 33.5V36.5C15 37.3438 15.6562 38 16.5 38H46.5C47.25 38 48 37.3438 48 36.5V33.5C48 32.75 47.25 32 46.5 32ZM46.5 2H16.5C15.6562 2 15 2.75 15 3.5V6.5C15 7.34375 15.6562 8 16.5 8H46.5C47.25 8 48 7.34375 48 6.5V3.5C48 2.75 47.25 2 46.5 2ZM46.5 17H16.5C15.6562 17 15 17.75 15 18.5V21.5C15 22.3438 15.6562 23 16.5 23H46.5C47.25 23 48 22.3438 48 21.5V18.5C48 17.75 47.25 17 46.5 17Z" fill="black"/>
            </svg>
          </button>
          <button class="main-buttons" id="related-sections-button">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39 16.5H25.5V3C25.5 1.40625 24.0938 0 22.5 0H19.5C17.8125 0 16.5 1.40625 16.5 3V16.5H3C1.3125 16.5 0 17.9062 0 19.5V22.5C0 24.1875 1.3125 25.5 3 25.5H16.5V39C16.5 40.6875 17.8125 42 19.5 42H22.5C24.0938 42 25.5 40.6875 25.5 39V25.5H39C40.5938 25.5 42 24.1875 42 22.5V19.5C42 17.9062 40.5938 16.5 39 16.5Z" fill="black"/>
            </svg>
          </button>
        </section>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

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
    // get the shadow root of this custom HTML element and set its ID to the given ID
    const root = this.shadowRoot.querySelector('.daily');
    root.id = id;

    // get all information about the date that is needed for the header display
    const dateObj = this.getDateFromID(id);
    const day = this.getDayFromDate(dateObj);
    const month = this.getMonthFromDate(dateObj);
    const date = dateObj.getDate();
    const suffix = this.getSuffixOfDate(dateObj);
    const dateString = `${day}, ${month} ${date}${suffix}`;

    // get the header text of this custom HTML element and set its contents to the constructed date string
    const headerText = root.querySelector('.header > h1');
    headerText.innerText = dateString;

    // creates all widgets in one section
    if (jsonData.widgets) {
      const widgetSection = document.createElement('section');
      widgetSection.className = 'widgets';
      widgetSection.innerHTML = `
        <h2>Widgets</h2>
        <button class="add" id="add-widget">Add widget</button >
        <button class="minimize" id="minimize-widgets">Minimize Widgets</button>
      `;

      for (const widget of jsonData.widgets) {
        console.log(widget);
        // MUST CONSTRUCT THE WIDGET HERE
      }

      root.appendChild(widgetSection);
    }

    // creates all trackers in one section
    if (jsonData.trackers) {
      const trackerSection = document.createElement('section');
      trackerSection.className = 'trackers';
      trackerSection.innerHTML = `
        <h2>Trackers</h2>
        <button class="add" id="add-tracker">Add tracker</button >
        <button class="minimize" id="minimize-trackers">Minimize Trackers</button>
      `;

      for (const tracker of jsonData.trackers) {
        console.log(tracker);
        // MUST CONSTRUCT THE TRACKER HERE
      }

      root.appendChild(trackerSection);
    }

    // loop through all sections in JSON data and construct and populate them
    if (jsonData.sections) {
      for (const section of jsonData.sections) {
        // construct section element
        const sectionElement = document.createElement('section');
        sectionElement.id = section.name;
        sectionElement.className = section.type;

        // construct section header element
        const sectionHeader = document.createElement('h2');
        sectionHeader.innerText = section.name;
        sectionElement.appendChild(sectionHeader);

        // construct bullet elements
        for (const bulletID of section.bulletIDs) {
          const bulletElement = document.createElement('bullet-entry');
          sectionElement.appendChild(bulletElement);
          Database.fetch(bulletID, this.createBullet, bulletID, bulletElement);
        }

        root.appendChild(sectionElement);
      }
    }

    this.setAttribute('data', JSON.stringify(jsonData));
  }

  /**
   * Parses the given ID to determine the year, month, and date, and returns a corresponding
   * Date object.
   * @param {string} id - The daily ID to parse
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
   * Takes a Date object, then retrieves and converts the day-of-week integer representation
   * into a logical string (English) format.
   * @param {Date} dateObj - The Date object from which to retrieve day-of-week
   * @returns {string} The day of the week, as a string in English
   */
  getDayFromDate (dateObj) {
    const dayIndex = dateObj.getDay();
    // convert 0-6 to Sun-Sat
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
   * Takes a Date object, then retrieves and converts the month integer representation
   * into a logical string (English) format.
   * @param {Date} dateObj - The Date object from which to retrieve month index
   * @returns {string} The month, as a string in English
   */
  getMonthFromDate (dateObj) {
    const monthIndex = dateObj.getMonth();
    // convert 0-11 to Jan-Dec
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
   * Takes a Date object, then retrieves and converts the date integer representation
   * into a logical string (English) format representing a suffix for such a number.
   *
   * 1 -> st
   * 2 -> nd
   * 3 -> rd
   * 4 -> th
   * ...
   *
   * 11,12,13 -> th
   *
   * @param {Date} dateObj - The Date object from which to retrieve the date
   * @returns {string} The suffix, (st,nd,rd,th) corresponding to the date integer
   */
  getSuffixOfDate (dateObj) {
    const date = dateObj.getDate();

    // Possible suffixes
    const ST = 'st';
    const ND = 'nd';
    const RD = 'rd';
    const TH = 'th';

    /*
      11, 12, 13 are special 'th'
      for all other ones digits:
      1 -> st
      2 -> nd
      3 -> rd
      0,4-9 -> th

      (No need to address 111,112,etc. because there is a cap at 31)
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
   *
   */
  createBullet (bulletData, bulletID, bulletElement) {
    if (bulletData) {
      bulletElement.data = [bulletID, bulletData];
    } else {
      bulletElement.data = [bulletID, {
        labelIDs: [],
        bulletIDs: [],
        text: '',
        value: -1
      }];
    }
  }
}

/** Define a custom element for the DailyLog web component */
customElements.define('daily-log', DailyLog);
