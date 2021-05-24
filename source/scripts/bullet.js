import { Database } from '../classes/database.js';

/**
 * This class contains a constructor and set/get data functions for the bullet custom HTML class
 * @classdesc
 * @example <caption>Bullet Entry class</caption>
 * //Example of a bullet Json object used to generate a bullet-entry element
 * const exampleBulletDay = [
    'B 210525 00 00',
    {
      labelIDs: [],
      text: 'Walk the dog',
      value: -1,
      childrenIDs: []
    }
 * ];
 * // Create a bullet custom element using data
 * const ID = generateID('bullet');
 * const bullet = document.createElement('bullet-entry');
 * bullet.data = [ID, exampleBulletDay];
 *
 * // Create a new bullet custom element from template
 * const ID = generateID('bullet');
 * const bullet = document.createElement('bullet-entry');
 * bullet.data = [ID, {}];
 *
 * @property {jsonObject} data - [string] labelIDs, string text, Number value, and [string] childrenIDs associated with this bulletEntry
 */

class BulletEntry extends HTMLElement {
/**
 * Constructs a blank bullet HTML element using the given HTML template
 * @constructor
 */
  constructor () {
    console.log('Constructor called');
    super();

    const template = document.createElement('template');

    template.innerHTML = `
      <style>
        .bullet-point {
          font-size:10px;
          border: none;
          background: none;
          float: left;
          padding-top: 7px;
        }

        .bullet-point:hover {
          font-size: 12px;
          position: relative;
          right: 1px;
          bottom: 1px;
          width: 22px;
        }

        .bullet-text {
          display: inline-block;
          width: 80%;
          font-size: larger;
          margin: 0;
          padding-left: 0.5em;
        }

        [contenteditable] {
          outline: 0px solid transparent;
        }
      </style>
      <link href="../assets/css/all.css" rel="stylesheet"> <!--load all styles -->
      <div class="bullet">
        <button class="bullet-point"><i class="fas fa-circle"></i></button>
        <p class="bullet-text" contenteditable="true">holdonmmmmmm </p>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * @returns {jsonObject} JSON object containing data representing this bullet element <p>
   * { labelIDs: [string] <p>
   *   text: string <p>
   *   value: Number <p>
   *   childrenIDs: [string] <p>
   * }
   */
  get data () {
    return JSON.parse(this.getAttribute('data'));
  }

  /**
   * Process for setting up data (mostly using shadowRoot) <p>
   *
   * 0. Checks if empty data is passed in, replaces data with an empty template instead <p>
   *
   * 1. BulletEntry values for id, text, and data set <p>
   *
   *   a. text is stored and used internally for determining when to update Database <p>
   *
   * 2. Now that data setup if done, will save to an attribute called data <p>
   *
   * 3. Grabs element that will contain bullet text and sets innerText value to either passed in text or template text <p>
   *
   *   a. `contenteditable` tag allows changing of text <p>
   *
   * 4. To be implemented: Update the type of bullet point based off value <p>
   *
   * 5. Add a listener to input once user stops focusing on it (blur -_-) <p>
   *
   *   a. Do a comparison between original text and current text <p>
   *
   *   b. Update interally stored text (for future reference) and update value on database <p>
   *
   * @param {[string, jsonObject]} - [bulletID, data for generating this bullet element]
   */
  set data ([id, jsonData]) {
    console.log('Setter called');

    if (Object.entries(jsonData).length === 0) {
      jsonData = {
        labelIDs: [],
        text: '',
        value: -1,
        childrenIDs: []
      };
      console.log('Setting empty template');
      this.storeToDatabase(id, jsonData, true);
    }

    this.id = id;
    this.text = jsonData.text;
    this.setAttribute('data', JSON.stringify(jsonData));

    const bulletText = this.shadowRoot.querySelector('.bullet-text');
    bulletText.innerText = this.text;

    /** Checklist toggle based off value
     * - Implemented using display: none
     */
    switch (jsonData.value) {
      case -1:
        break;
      case 0:
        break;
      case 1:
        break;
    }

    bulletText.addEventListener('blur', (event) => {
      if (bulletText.innerText !== this.data.text) {
        jsonData.text = bulletText.innerText;
        this.setAttribute('data', JSON.stringify(jsonData));
        this.storeToDatabase(id, jsonData, true);
      }
    });
  }

  /**
   * Stores Obj using id to database, optionally logging on success or fail
   * @param {string} id - ID to store under
   * @param {jsonObject} jsonData - Data to be stored
   * @param {bool} log - whether or not to log Success/Fail
   */
  storeToDatabase (id, jsonData, log = false) {
    Database.store(id, jsonData, (success) => {
      if (log) {
        if (success) {
          console.log(`Stored ${id} to database`);
        } else {
          console.log(`Failed to store ${id} to database`);
        }
      }
    });
  }
}

/** Define a custom element for the BulletEntry web component */
customElements.define('bullet-entry', BulletEntry);

/** Example data
  const exampleBulletDay = [
    'B 210525 00 00',
    {
      labelIDs: [],
      text: 'Walk the dog',
      value: -1,
      childrenIDs: []
    }
  ];

  const exampleBulletMonth = [
    'B 2105 00',
    {
      labelIDs: [],
      text: 'Walk the dog',
      value: -1,
      childrenIDs: []
    }
  ];

  const exampleBulletYear = [
    'B 21 1 00',
    {
      labelIDs: [],
      text: 'Walk the dog',
      value: -1
    }
  ];
 */
