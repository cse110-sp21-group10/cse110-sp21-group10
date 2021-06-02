import { Database } from './database.js';
import { IDConverter } from './IDConverter.js';

/**
 * This class contains functions to construct and edit the daily log custom HTML element.
 *
 * @classdesc
 * @example <caption>Daily Log class</caption>
 * // Example of a daily JSON object used to generate a daily-log element
 * const exampleDailyJSON = {
 *   trackers: [
 *     {
 *       type: 'slider',
 *       name: 'Mood',
 *       value: 3
 *     },
 *     {
 *       type: 'slider',
 *       name: 'Sleep Quality',
 *       value: 5
 *     },
 *     {
 *       type: 'numInput',
 *       name: 'Calorie Intake',
 *       value: 2500
 *     },
 *     {
 *       type: 'numInput',
 *       name: 'Money Spent',
 *       value: 25
 *     },
 *     {
 *       type: 'checkbox',
 *       name: 'Exercise',
 *       value: 0
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
          
          <div class="container">
            <div class="weather-container">
              <div class="weather-icon">
                  <img src="../assets/icons/unknown.png" alt="">
              </div>
              <div class="temperature-value">
                  <p>&nbsp °<span>C</span></p>
              </div>
              <div class="temperature-description">
                  <p>-</p>
              </div>  
            </div>
          </div>

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
   * goes through each attribute of the daily log object to construct the trackers and notes
   * sections of the element. Each notes section is constructed by fetching the data of
   * each bullet in the section from the database, and creating a custom bullet-entry HTML
   * element that is appended to the section. Finally, the setAttribute function is called
   * on this element to set the 'data' attribute of the element to be the given JSON data,
   * so that the data can be retrieved from the element later if needed.
   *
   * @param {Array.<{id: string, jsonData: Object, callback: function}>} data - Array of three
   * elements (first element is the string ID of the object, second element is the JSON object
   * data, third element is a callback to update the dayID[] "entries" for jumping between
   * entries) that is used to construct and set the data in this HTML element
   */
  set data ([id, jsonData, callback]) {
    // store this object in a variable so it can be passed to handlers later
    const dailyLog = this;

    // set the id of the custon element to the given id
    this.id = id;

    // if the jsonData is an empty object, then we should create an empty daily element
    if (Object.entries(jsonData).length === 0) {
      jsonData = {
        trackers: [
          {
            type: 'slider',
            name: 'Mood',
            value: 1
          },
          {
            type: 'slider',
            name: 'Sleep Quality',
            value: 1
          },
          {
            type: 'numInput',
            name: 'Calorie Intake',
            value: 0
          },
          {
            type: 'numInput',
            name: 'Money Spent',
            value: 0
          },
          {
            type: 'checkbox',
            name: 'Exercise',
            value: 0
          }
        ],
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

    // add event listener for the add section button in the header
    const newSectionButton = root.querySelector('#related-sections-button');
    newSectionButton.addEventListener('click', function (event) {
      dailyLog.newSectionHandler(event.target.closest('div.daily'));
      callback();
    });

    // get all information about the date that is needed for the header display
    const dateObj = IDConverter.getDateFromID(id);
    const day = IDConverter.getDayFromDate(dateObj);
    const month = IDConverter.getMonthFromDate(dateObj);
    const date = dateObj.getDate();
    const suffix = IDConverter.getSuffixOfDate(dateObj);
    const dateString = `${day}, ${month} ${date}${suffix}`;

    // get the header text of this custom HTML element and set its contents to the constructed date string
    const headerText = root.querySelector('#daily-header > h1');
    headerText.innerText = dateString;

    // creates all trackers in one section
    if (jsonData.trackers && jsonData.trackers.length > 0) {
      // construct tracker section element
      const trackerSection = document.createElement('section');
      trackerSection.className = 'trackers';

      // optional tracker elements if we want to implement
      // <button class="add" id="add-tracker">Add Tracker</button>
      // <button class="minimize" id="minimize-trackers">Minimize Trackers</button>
      trackerSection.innerHTML = `
        <h2>Trackers</h2>
      `;

      for (const tracker of jsonData.trackers) {
        // create a div for the tracker
        const trackerDiv = document.createElement('div');
        trackerDiv.className = 'tracker';

        // construct the title of the tracker
        const trackerTitle = document.createElement('h3');
        trackerTitle.innerText = tracker.name;
        trackerDiv.appendChild(trackerTitle);

        // get the appropriate tracker element based on what type of tracker this is
        let trackerEl;
        switch (tracker.type) {
          case 'slider':
            trackerEl = this.createSlider(tracker);
            break;
          case 'checkbox':
            trackerEl = this.createCheckbox(tracker);
            break;
          case 'numInput':
            trackerEl = this.createNumInput(tracker);
            break;
          default:
            console.log('No tracker implementation found: ' + tracker.type);
            break;
        }
        trackerDiv.appendChild(trackerEl);

        // add the tracker to the tracker section
        trackerSection.appendChild(trackerDiv);
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

        // added a margin to the bottom of each section
        sectionElement.style = 'margin-bottom: 1vw';

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
          <i class="fas fa-plus"></i>
        `;
        newNoteButton.addEventListener('click', function (event) {
          dailyLog.newNoteHandler(event.target.closest('section'));
          callback();
        });
        sectionElement.appendChild(newNoteButton);

        root.appendChild(sectionElement);
      }
    }

    // set the data attribute of this element to the given JSON data so it can be retrieved later
    this.setAttribute('data', JSON.stringify(jsonData));

    // The scipt for the weather

    // Select Elements
    const iconElement = this.shadowRoot.querySelector('.weather-icon');
    const tempElement = this.shadowRoot.querySelector('.temperature-value p');
    const descElement = this.shadowRoot.querySelector('.temperature-description p');
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
      iconElement.innerHTML = `<img src="../assets/icons/${weather.iconId}.png"/>`;
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

  // ----------------------------------- End Get/Set Functions ------------------------------------

  // ----------------------------------- Start Helper Functions -----------------------------------

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
    const bulletCount = IDConverter.stringifyNum(newBulNum);
    const dailyID = this.shadowRoot.querySelector('div.daily').id;

    return `B ${dailyID.substring(2)} ${sectionID} ${bulletCount}`;
  }

  /**
   * This function is a helper function to create a slider for trackers that are to be presented
   * in the slider format. The function first creates a div element to hold the 3 pieces of the
   * slider element. The first two elements in the slider div are the frown and smile icons that
   * are there to help the user see what each extreme of the slider means. The function then
   * creates the html input element with the type 'range', and sets its value based on the value
   * in the tracker object. Then, the function adds an event listener to the slider so that
   * the JSON object data gets updated for the daily log object and in the database when the slider
   * value gets changed. Finally, the slider div is returned so that it can be appended to the
   * trackers section.
   *
   * @param {Object} tracker - The JSON object of the tracker being created
   * @returns {HTMLElement} A div element containing the slider and the icons to show what each
   * extreme of the slider signifies
   */
  createSlider (tracker) {
    // slider overlay div creation
    const sliderDiv = document.createElement('div');
    sliderDiv.className = 'slider-div';

    // frowny face and smiley face for the ends of the slider
    sliderDiv.innerHTML = `
      <i class="far fa-frown"></i>
      <i class="far fa-smile"></i>
    `;

    // actual slider creation
    const slider = document.createElement('input');
    slider.id = tracker.name;
    slider.className = 'slider';
    slider.type = 'range';
    slider.min = '1';
    slider.max = '10';
    slider.step = '1';
    // set value of slider based on data
    slider.value = `${tracker.value}`;

    // add change listener for updates
    const dailyLog = this;
    slider.addEventListener('change', (event) => {
      const data = dailyLog.data;
      // finds the tracker associated with this slider
      // then changes it based on the new value
      for (const trackerObj of data.trackers) {
        if (trackerObj.name === tracker.name) {
          trackerObj.value = Number(String(event.target.value));
        }
      }
      dailyLog.setAttribute('data', JSON.stringify(data));
      Database.store(dailyLog.id, data);
    });

    // get the icon that should be on the right of the slider, and insert the slider before it
    const rightIcon = sliderDiv.querySelector('i:nth-child(2)');
    sliderDiv.insertBefore(slider, rightIcon);

    return sliderDiv;
  }

  /**
   * This function is a helper function to create a checkbox for trackers that are to be presented
   * in the checkbox format. The function first creates the html input element with the type 'checkbox',
   * and sets its checked attribute based on the value in the tracker object. Then, the function adds
   * an event listener to the checkbox so that the JSON object data gets updated for the daily log
   * object and in the database when the checkbox gets checked or unchecked. Finally, the checkbox
   * element is returned so that it can be appended to the trackers section.
   *
   * @param {Object} tracker - The JSON object of the tracker being created
   * @returns {HTMLElement} The checkbox input element to be displayed as the tracker
   */
  createCheckbox (tracker) {
    // checkbox element creation
    const checkboxEl = document.createElement('input');
    checkboxEl.id = tracker.name;
    checkboxEl.className = 'checkbox';
    checkboxEl.type = 'checkbox';
    checkboxEl.value = tracker.name;
    // set checked value based on data
    checkboxEl.checked = tracker.value === 1;

    // add change listener for updates
    const dailyLog = this;
    checkboxEl.addEventListener('change', (event) => {
      const data = dailyLog.data;
      for (const trackerObj of data.trackers) {
        // check if this is the right tracker object
        if (trackerObj.name === tracker.name) {
          // if the tracker value is currently 1 (means it is checked), we want to uncheck it
          // if the tracker object is 0 (means it is unchecked), we want to check it
          if (trackerObj.value === 1) {
            trackerObj.value = 0;
          } else {
            trackerObj.value = 1;
          }
        }
      }
      dailyLog.setAttribute('data', JSON.stringify(data));
      Database.store(dailyLog.id, data);
    });

    return checkboxEl;
  }

  /**
   * This function is a helper function to create a number input for trackers that are to be presented
   * in the number input format. The function first creates the html input element with the type 'number',
   * and sets its value based on the value in the tracker object. Then, the function adds an event listener
   * to the input element so that the JSON object data gets updated for the daily log object and in the
   * database when the number input gets changed (note that if the inputted number is negative, the data
   * is not updated because a negative input does not make sense in the context of these trackers). Finally,
   * the number input element is returned so that it can be appended to the trackers section.
   *
   * @param {Object} tracker - The JSON object of the tracker being created
   * @returns {HTMLElement} The number input element to be displayed as the tracker
   */
  createNumInput (tracker) {
    // number input element creation
    const numInputEl = document.createElement('input');
    numInputEl.id = tracker.name;
    numInputEl.className = 'numInput';
    numInputEl.type = 'number';
    numInputEl.min = 0;
    // set num input based on data
    numInputEl.value = `${tracker.value}`;

    // add change listener for updates
    const dailyLog = this;
    numInputEl.addEventListener('change', (event) => {
      const inputVal = Number(String(event.target.value));
      // only record if it is non-negative
      if (inputVal >= 0) {
        const data = dailyLog.data;
        for (const trackerObj of data.trackers) {
          // check that this is the right tracker object
          if (trackerObj.name === tracker.name) {
            trackerObj.value = inputVal;
          }
        }
        dailyLog.setAttribute('data', JSON.stringify(data));
        Database.store(dailyLog.id, data);
      }
    });

    return numInputEl;
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

    // create a blank bullet element with the generated ID
    const bullet = document.createElement('bullet-entry');
    this.setBulletData({}, bulletID, bullet, sectionID);

    // add event listeners to the bullet element to handle deletion
    const dailyLog = this;
    bullet.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
      // condition check to determine if backspace was pressed on an empty note
      if (event.keyCode === 8 && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
        dailyLog.deleteNoteHandler(bullet);
      }
    });
    bullet.shadowRoot.querySelector('.bullet-remove').addEventListener('click', function (event) {
      dailyLog.deleteNoteHandler(bullet);
    });

    // insert the new bullet element child before the new note button
    const newNote = sectionElement.querySelector('button.new-bullet');
    sectionElement.insertBefore(bullet, newNote);

    // prompt user to start typing note
    bullet.shadowRoot.querySelector('.bullet-text').focus();
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
    const sectionID = IDConverter.stringifyNum(this.nextSectionNum);
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

    // create a blank section element with the section ID
    const section = document.createElement('section');
    section.id = sectionObj.id;
    section.className = sectionObj.type;

    // added a margin to the bottom of each section
    section.style = 'margin-bottom: 1vw';

    // create the editable section title element
    const sectionTitle = document.createElement('h2');
    sectionTitle.contentEditable = 'true';
    section.appendChild(sectionTitle);

    // add event listener to the title to update the daily log element when the title text is updated
    sectionTitle.addEventListener('blur', (event) => {
      const sectionName = dailyLog.data.sections.filter((section) => section.id === sectionID)[0].name;
      if (sectionTitle.innerText !== sectionName) {
        const dailyData = dailyLog.data;
        for (const sec of dailyData.sections) {
          if (sec.id === sectionID) {
            sec.name = sectionTitle.innerText;
          }
        }
        this.setAttribute('data', JSON.stringify(dailyData));
        Database.store(dailyID, dailyData);
      }
    });

    // add event listener to the title to prevent newlines
    sectionTitle.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        sectionTitle.blur();
      }
    });

    // create a button to delete the section and add the delete section event listener to it
    const deleteSection = document.createElement('button');
    deleteSection.className = 'delete-section';
    deleteSection.innerText = 'Delete Section';
    deleteSection.addEventListener('click', function (event) {
      dailyLog.deleteSectionHandler(event.target.closest('section'));
    });
    section.appendChild(deleteSection);

    // create a button to add new notes to the section and add the add new bullet event listener to it
    const newNote = document.createElement('button');
    newNote.className = 'new-bullet';
    newNote.innerHTML = `
      <i class="fas fa-plus"></i>
    `;
    newNote.addEventListener('click', function (event) {
      dailyLog.newNoteHandler(event.target.closest('section'));
    });
    section.appendChild(newNote);

    divElement.appendChild(section);

    // prompt user to start typing section name
    sectionTitle.focus();
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
