import { Database } from './database.js';

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

        .children {
          padding-left: 20px;
        }

        [contenteditable] {
          outline: 0px solid transparent;
        }
      </style>
      <link href="../assets/css/all.css" rel="stylesheet"> <!--load all styles -->
      <div class="bullet">
        <button class="bullet-point"><i class="fas fa-circle"></i></button>
        <p class="bullet-text" contenteditable="true">holdonmmmmmm </p>
        <div class="children"> </div>
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
   * 4. Iterates through children and recursively sets their values <p>
   *
   * 5. To be implemented: Update the type of bullet point based off value <p>
   *
   * 6. Add a listener to input once user stops focusing on it (blur -_-) <p>
   *
   *   a. Do a comparison between original text and current text <p>
   *
   *   Edit: Also make sure that there is text to store ( no blanks, no empty newlines ) <p>
   *
   *   b. Update interally stored text (for future reference) and update value on database <p>
   *
   * @param {Array.<{id: string, jsonData: Object}>} data - Array of two elements (first element
   * @param {Object []} - [ID, data] pair used to create, load, and store bullet data from DB
   * [string, jsonObject]} - [bulletID, data for generating this bullet element]
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

    /** Iterate through children
     * create bulletEntry + set data
     * handles deletion via backspace on empty
     * append to children div
     */
    this.setChildren();

    /** Iterate through labels
     *
     */

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
      if (bulletText.innerText && bulletText.innerText !== this.data.text && bulletText.innerText !== '\n') {
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

  /**
   * Handles the creation, appending, and deletion (if done via backspace) of children <p>
   *
   * Iterates through each childID in data: <p>
   *
   * 1. Creates a new bullet-entry element <p>
   *
   * 2. Fetches and sets data <p>
   *
   * 3. Appends child under appropriate div in current bullet element <p>
   *
   * 4. Registers button presses for children's text and under the right conditions,
   * will remove child from display, database, and this bullet's childIDs list
   */
  setChildren () {
    for (const childID of this.data.childrenIDs) {
      const child = document.createElement('bullet-entry');

      Database.fetch(childID, (data) => {
        if (data) {
          child.data = [childID, data];
        } else {
          console.log(`Something went wrong when fetching data for child: ${childID}`);
        }
      });

      this.shadowRoot.querySelector('.children').appendChild(child);

      /**
       * Handles deletion of a child bullet from display, database, and childIDs list under the right conditions
       * @param {BulletEntry~deleteChildCallback} callback - Decides whether to delete and does so where needed
       *
       */
      child.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
          this.shadowRoot.querySelector('.children').removeChild(child);
          Database.delete(childID);
          this.data.childrenIDs = this.data.childrenIDs.filter(child => child !== childID);
        }
      });
    }
  }

  /**
   * Deletion triggers if backspace is pressed when either there is no input or input is just a single newline (handles a bug we found) <p>
   *
   * Removal starts with display - specifically removing child from div for containing children under this bullet.
   * Note that if a child bullet is deleted with children (grand-children of current bullet) under it,
   * the grand-children will also disappear from display but will still exist in database and child's childID list
   * (not an issue since this childID will never be re-used) <p>
   *
   * Next the childID is used to remove from Database as well <p>
   *
   * Finally, the childIDs data is updated with the removal of the childID
   *
   * @callback BulletEntry~deleteChildCallback
   * @param {keydownEvent} event - provides access to key that was clicked as well as element that event was triggered under
   */
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
