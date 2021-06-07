import { Database } from '../classes/database.js';
import { IDConverter } from './IDConverter.js';

// tell the linter that Chart is defined by a previous script
/* global Chart */

/**
 * This class contains functions to construct and edit the monthly log custom HTML element.
 *
 * @classdesc
 * @example <caption>Monthly Log class</caption>
 * // Example of a monthly JSON object used to generate a monthly-log element
 * const exampleMonthlyJSON = {
 *   sections: [
 *     {
 *       id: '00',
 *       name: 'Monthly Goals',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 2105 00 00',
 *         'B 2105 00 01'
 *       ],
 *       nextBulNum: 2
 *     },
 *     {
 *       id: '01',
 *       name: 'Monthly Notes',
 *       type: 'log',
 *       bulletIDs: [
 *         'B 2105 01 00',
 *         'B 2105 01 01'
 *       ],
 *       nextBulNum: 2
 *     }
 *   ]
 * }
 * // Create a new monthly log HTML element using the object
 * let monthly = document.createElement('monthly-log');
 * monthly.data = exampleMonthlyJSON;
 */

class MonthlyLog extends HTMLElement {
  // -------------------------------------- Start Constructor -------------------------------------

  /**
   * Constructs a blank monthly log HTML element using the defined HTML template
   *
   * @constructor
   */
  constructor () {
    super();

    const template = document.createElement('template');

    template.innerHTML = `
      <link rel="stylesheet" href="../style/style.css">
      <link rel="stylesheet" href="../assets/css/all.css">
      <div class="monthly">
        <section class="header" id="monthly-header">
          <h1></h1>
        </section>
        <section id="monthly-calendar"></section>
        <section id="monthly-checks"></section>
        <section id="monthly-charts"></section>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // --------------------------------------- End Constructor --------------------------------------

  // ---------------------------------- Start Get/Set Functions -----------------------------------

  /**
   * This function returns the data stored in this monthly element as a JSON object.
   *
   * @returns {Object} JSON representation of data used to generate this monthly log element
   */
  get data () {
    return JSON.parse(this.getAttribute('data'));
  }

  /**
   * This function constructs the monthly log HTML element using the given ID and monthly log
   * object data. It starts by constructing and setting the header text for the element. It then
   * creates the buttons for the monthly calendar, and constructs the charts for the different
   * trackers (mood, sleep, etc). Next it goes through each attribute of the monthly log object
   * to construct the notes sections of the element. Each notes section is constructed by fetching
   * the data of each bullet in the section from the database, and creating a custom bullet-entry
   * HTML element that is appended to the section. Finally, the setAttribute function is called on
   * this element to set the 'data' attribute of the element to be the given JSON data, so that
   * the data can be retrieved from the element later if needed.
   *
   * @param {Array.<{id: string, jsonData: Object, callback: function}>} data - Array of three
   * elements (first element is the string ID of the object, second element is the JSON object
   * data, and the third element is the callback function for zooming into a certain date) that
   * is used to construct and set the data in this HTML element
   */
  set data ([id, jsonData, callback]) {
    // store this object in a variable so it can be passed to handlers later
    const monthlyLog = this;

    // set the id of the custon element to the given id
    this.id = id;

    // if the jsonData is an empty object, then we should create an empty monthly element
    if (Object.entries(jsonData).length === 0) {
      jsonData = {
        sections: [
          {
            id: '00',
            name: 'Monthly Goals',
            type: 'log',
            bulletIDs: [],
            nextBulNum: 0
          },
          {
            id: '01',
            name: 'Monthly Notes',
            type: 'log',
            bulletIDs: [],
            nextBulNum: 0
          }
        ]
      };
    }

    // get the shadow root of this custom HTML element and set its ID to the given ID
    const root = this.shadowRoot.querySelector('div.monthly');
    root.id = id;

    // get all information about the date that is needed for the header display
    const dateObj = IDConverter.getDateFromID(id, 'month');
    const month = IDConverter.getMonthFromDate(dateObj);
    const year = dateObj.getFullYear();
    const dateString = `${month} ${year}`;

    // get the header text of this custom HTML element and set its contents to the constructed date string
    const headerText = root.querySelector('#monthly-header > h1');
    headerText.innerText = dateString;

    // IDs to use for the charts
    const canvasIDs = ['mood-tracker', 'sleepq-tracker', 'calorie-tracker', 'money-tracker'];
    const charts = []; // array of all the charts

    // Make this cleaner (hopefully without hard-coding) if we have time
    // creates the canvas elements/charts for each tracker
    for (let i = 0; i <= 3; i++) {
      // create the canvas element and append it to the charts section
      const canvas = document.createElement('canvas');
      canvas.className = 'chart';
      canvas.id = canvasIDs[i];
      root.querySelector('#monthly-charts').appendChild(canvas);

      // set the label of the y-axis of the chart based on what kind of tracker this is
      let yAxisLabel = '';
      switch (i) {
        case 0:
          yAxisLabel = 'Mood';
          break;
        case 1:
          yAxisLabel = 'Sleep Quality';
          break;
        case 2:
          yAxisLabel = 'Calorie Intake';
          break;
        case 3:
          yAxisLabel = 'Money Spent';
          break;
      }

      // construct the chart and apply to canvas
      // get the canvas context and create the new chart
      // the chart starts off empty, but gets populated with each fetch call for daily data
      const ctx = canvas.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line', // line chart
        data: {
          labels: [], // x-axis labels
          datasets: [{
            data: [], // data points
            borderCapStyle: 'round',
            fill: false,
            borderColor: 'black',
            borderWidth: 2,
            pointBackgroundColor: 'black',
            pointRadius: 2,
            pointHoverRadius: 2,
            tension: 0.25
          }]
        },
        options: {
          scales: {
            x: { // x-axis contents
              axis: 'x',
              position: 'bottom',
              title: {
                display: true,
                text: 'Date'
              },
              grid: {
                display: false
              }
            },
            y: { // y-axis contents
              axis: 'y',
              position: 'left',
              title: {
                display: true,
                text: yAxisLabel
              },
              grid: {
                display: false
              },
              min: 0 // min-value of y-axis
              // potential max-value can be added here
            }
          },
          plugins: {
            legend: {
              display: false // don't show the legend
            }
          }
        }
      });
      chart.render(); // render the initial chart (will get updated when data is updated)
      charts.push(chart);
    }

    // 1: create buttons for each date in the monthly calendar
    // 2: fetch the daily object for each date, and add its data to the tracker charts
    const calendar = root.querySelector('#monthly-calendar');
    const numDays = dateObj.getDate();

    // create the section for exercise checkboxes
    const exerciseTracker = document.createElement('div');
    root.querySelector('#monthly-checks').appendChild(exerciseTracker);
    exerciseTracker.style.display = 'flex';
    exerciseTracker.style.flexDirection = 'row';
    const exerciseTrackerHeading = document.createElement('div');
    exerciseTrackerHeading.innerText = 'Exercise:';
    exerciseTracker.appendChild(exerciseTrackerHeading);
    const exerciseTrackerBoxes = document.createElement('div');
    exerciseTrackerBoxes.className = 'tracking-boxes';
    exerciseTrackerBoxes.style.display = 'flex';
    exerciseTrackerBoxes.style.flexDirection = 'row';
    exerciseTracker.appendChild(exerciseTrackerBoxes);

    for (let i = 1; i <= numDays; i++) {
      // date button creation
      const dateID = `D ${id.substring(2)}${IDConverter.stringifyNum(i)}`;
      const dateButton = document.createElement('button');
      dateButton.className = 'monthly-calendar-button';
      dateButton.id = dateID;
      dateButton.innerText = String(i);
      dateButton.addEventListener('click', function (event) {
        callback(event);
      });
      calendar.appendChild(dateButton);

      // after pulling tracker data, adjust the charts with the new data
      // add the x-axis date labels to each chart
      for (const chart of charts) {
        chart.data.labels.push(i);
      }

      const exerciseTrackerBox = document.createElement('div');
      exerciseTrackerBox.style.display = 'flex';
      exerciseTrackerBox.style.flexDirection = 'column';
      exerciseTrackerBox.style.textAlign = 'center';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.disabled = 'true';
      checkbox.checked = false;
      checkbox.className = 'check';
      exerciseTrackerBox.appendChild(checkbox);
      const datePar1 = document.createElement('p');
      datePar1.style.margin = '0';
      datePar1.style.lineHeight = '0.9';
      datePar1.innerText = String(i).charAt(0);
      const datePar2 = document.createElement('p');
      datePar2.style.margin = '0';
      datePar2.style.lineHeight = '0.9';
      if (String(i).length > 1) {
        datePar2.innerText = String(i).charAt(1);
      }
      exerciseTrackerBox.appendChild(datePar1);
      exerciseTrackerBox.appendChild(datePar2);
      exerciseTrackerBoxes.appendChild(exerciseTrackerBox);

      // get the data for the chart
      Database.fetch(dateID, function (data, date) {
        // if data is present
        if (data) {
          for (const tracker of data.trackers) {
            // get chart for the tracker
            let trackerChart = null;
            switch (tracker.name) {
              case 'Mood':
                trackerChart = charts[0];
                break;
              case 'Sleep Quality':
                trackerChart = charts[1];
                break;
              case 'Calorie Intake':
                trackerChart = charts[2];
                break;
              case 'Money Spent':
                trackerChart = charts[3];
                break;
              case 'Exercise':
                checkbox.checked = tracker.value === 1;
                break;
            }

            // update chart data with tracker data
            if (trackerChart) {
              trackerChart.data.datasets[0].data[date - 1] = tracker.value;
            }
          }
        } else {
          for (const chart of charts) {
            chart.data.datasets[0].data[date - 1] = undefined;
          }
        }

        // update chart by the last day of the month
        if (date === numDays) {
          for (const chart of charts) {
            chart.update();
          }
        }
      }, i);
    }

    const divElement = document.createElement('div');
    divElement.className = "notes";

    root.appendChild(divElement);

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
              monthlyLog.deleteNoteHandler(bulletElement);
            }
          });
          bulletElement.shadowRoot.querySelector('.bullet-remove').addEventListener('click', function (event) {
            monthlyLog.deleteNoteHandler(bulletElement);
          });

          sectionElement.appendChild(bulletElement);

          // fetch the bullet data and set the bullet element's data in the callback
          Database.fetch(bulletID, function (bulletData, bulletID, bulletElement, sectionID) {
            monthlyLog.setBulletData(bulletData, bulletID, bulletElement, sectionID);
          }, bulletID, bulletElement, sectionID);
        }

        // create a button to add new notes to the section and add the add new bullet event listener to it
        const newNoteButton = document.createElement('button');
        newNoteButton.className = 'new-bullet';
        newNoteButton.innerHTML = `
          <i class="fas fa-plus"></i>
        `;
        newNoteButton.addEventListener('click', function (event) {
          monthlyLog.newNoteHandler(event.target.closest('section'));
        });
        sectionElement.appendChild(newNoteButton);

        divElement.appendChild(sectionElement);
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
   * the appropriate section of the monthly log and generate a bullet ID for sub-bullets (nested
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
    const monthlyLog = this;
    const newBulletID = function () {
      const newID = monthlyLog.generateBulletID(sectionID);
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
   * bullet count for that section, the section ID, and the date of the monthly object in which
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
    const monthlyID = this.shadowRoot.querySelector('div.monthly').id;

    return `B ${monthlyID.substring(2)} ${sectionID} ${bulletCount}`;
  }

  // ------------------------------------ End Helper Functions ------------------------------------

  // ------------------------------------ Start Event Handlers ------------------------------------

  /**
   * This function creates a new bullet. It first generates a bullet ID by combining the date of
   * the monthly log to which the bullet will belong, the ID of the section to which the bullet
   * is being added, and the ID of the new bullet, which is determined based on the number of
   * bullets currently in the section. It then adds the bullet ID to the monthly JSON object in
   * the appropriate section, and stores the updated monthly JSON object in the database. Lastly,
   * it creates a new bullet-entry HTML element, and adds the appropriate event listener to it
   * to allow for future deletion of the bullet element.
   *
   * @param {HTMLElement} sectionElement - The section element in which the new note button
   * was clicked to trigger the listener
   */
  newNoteHandler (sectionElement) {
    // generate a bullet ID
    const sectionID = sectionElement.id;
    const monthlyID = this.shadowRoot.querySelector('div.monthly').id;
    const bulletID = this.generateBulletID(sectionID);

    // add bullet ID to the monthly JSON object bulletIDs in the right section
    const data = this.data;
    for (const sec of data.sections) {
      if (sec.id === sectionID) {
        sec.bulletIDs.push(bulletID);
      }
    }
    this.setAttribute('data', JSON.stringify(data));

    // store the updated monthly JSON object in the database
    Database.store(monthlyID, data);

    // create a blank bullet element with the generated ID
    const bullet = document.createElement('bullet-entry');
    this.setBulletData({}, bulletID, bullet, sectionID);

    // add event listeners to the bullet element to handle deletion
    const monthlyLog = this;
    bullet.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', function (event) {
      // condition check to determine if backspace was pressed on an empty note
      if (event.keyCode === 8 && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
        monthlyLog.deleteNoteHandler(bullet);
      }
    });
    bullet.shadowRoot.querySelector('.bullet-remove').addEventListener('click', function (event) {
      monthlyLog.deleteNoteHandler(bullet);
    });

    // add the insert the new bullet element child before the new note button
    const newNote = sectionElement.querySelector('button.new-bullet');
    sectionElement.insertBefore(bullet, newNote);

    // prompt user to start typing note
    bullet.shadowRoot.querySelector('.bullet-text').focus();
  }

  /**
   * This function handles the deletion of a bullet. The function looks through the monthly JSON
   * object to remove the ID of the bullet being deleted from the appropriate section, and then
   * stores the updated monthly JSON object in the database and removes the bullet-entry HTML
   * element from the section.
   *
   * @param {HTMLElement} bulletElement - The bullet-entry element that is being deleted
   */
  deleteNoteHandler (bulletElement) {
    // get the section element that the bullet is a child of
    const section = bulletElement.closest('section');

    // loop through the monthly JSON object to find the bullet ID to be deleted
    const sectionID = section.id;
    const data = this.data;
    for (const sec of data.sections) {
      // condition check to determine if this is the right section in the monthly JSON object
      if (sec.id === sectionID) {
        sec.bulletIDs = sec.bulletIDs.filter((bulletID) => bulletID !== bulletElement.id);
      }
    }
    this.setAttribute('data', JSON.stringify(data));

    // store the updated monthly JSON object in the database
    const monthlyID = this.shadowRoot.querySelector('div.monthly').id;
    Database.store(monthlyID, data);

    // delete the bullet from the database
    Database.delete(bulletElement.id);

    // remove the bullet-entry HTML element from the section
    section.removeChild(bulletElement);
  }

  // ------------------------------------- End Event Handlers -------------------------------------
} // end class MonthlyLog

// define a custom element for the MonthlyLog web component
customElements.define('monthly-log', MonthlyLog);
