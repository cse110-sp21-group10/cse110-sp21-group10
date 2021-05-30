import { Database } from './database.js';
import { generateID } from '../scripts/script.js';

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
 * @property {jsonObject} data associated with this bulletEntry
 * @property {string[]} data.labelIDs - IDs of the labels assigned
 * @property {Number} data.value - value that determines the type of bullet (e.g. unchecked, dashed, crossed-off)
 * @property {string[]} data.childrenIDs - IDs of direct children bullets under this bullet
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
          padding-top: .4%;
        }

        div < div.bullet-remove {
          color: transparent;
        }
        
        .bullet-point:hover {
          font-size: 12px;
          position: relative;
          padding-top: .35%;
          right: 1px;
          width: 22px;
        }
        
        .bullet-text {
          display: inline-block;
          width: 90%;
          font-size: larger;
          margin: 0;
          /* border: 5px solid black; */
        
          padding-left: 1%;
        }
        
        .bullet {
          margin-left: 1.8%;

          padding-left: .5%;
          padding-top: .5%;

          background-color: white;
        }

        .bullet:hover {
          filter: brightness(96%);
          border-radius: 20px;
        }
        
        .bullet:hover .bullet-remove,
        .bullet:hover .child-add {
          color: black;
        }
        
        .child-add {
          float: left;
          max-width: 1.5%;
        }

        .bullet-remove {
          float: right;
          padding-right: 1%;
        }

        .bullet-remove:hover {
          font-size: 15px;
          position: relative;
          padding-top: .1%;
        }

        .child-add:hover {
          font-size: 15px;
          position: relative;
          padding-top: .1%;
        }

        .child-add,
        .bullet-remove {
          padding-top: .2%;

          color: transparent;
        
          border: none;
          background-color: transparent;
        }
        
        [contenteditable] {
          outline: 0px solid transparent;
        }
      </style>
      
      <link href="../assets/css/all.css" rel="stylesheet"> <!--load all styles -->

      <div class="bullet"> 
        <button class="child-add"><i class="fas fa-level-up-alt fa-rotate-90"></i></button>      
        <button class="bullet-point"><i class="fas fa-circle"></i></button>
        <button class="bullet-remove"><i class="fas fa-times"></i></button>
        
        <p class="bullet-text" contenteditable="true">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
          dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // ------------------------------------- Start of Set/Get definitions -------------------------------------------------
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
   * Checks if jsonData is empty, replacing data with an empty template
   * and writing newly created bullet data to DB <p>
   *
   * Sets up BulletEntry values for id, text, and data. Text is stored
   * and used internally for determining when to update DB <p>
   *
   * Fills display with input text, either passed in or generated from template <p>
   *
   * Iterates through children and recursively sets their values, as well as any
   * eventListeners or data updates <p>
   *
   * Adds a listener to handle changes to input once user stops focusing on it (called blur -_-) <p>
   *
   * TODO: Implement a way to update the type of bullet point based off value <p>
   *
   * @param {Array.<{id: string, jsonData: Object}>} data - [ID, data] pair used to create, load, and store bullet data to and from DB
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

    /**
     * Handles saving changes to bullet text to internal data and database under the right conditions
     * @param {BulletEntry~editTextCallback} callback - Decides whether to update data and does so where needed
     */
    bulletText.addEventListener('blur', (event) => {
      if (bulletText.innerText && bulletText.innerText !== this.data.text && bulletText.innerText !== '\n') {
        jsonData.text = bulletText.innerText;
        this.setAttribute('data', JSON.stringify(jsonData));
        this.storeToDatabase(id, jsonData, true);
      }
    });

    this.shadowRoot.querySelector('.child-add').addEventListener('click', () => {
      this.createChild();
    });
  }
  // -------------------------------------- End of Set/Get definitions --------------------------------------------------

  // ------------------------------------- Start of Callback definitions -------------------------------------------------
  /**
   * Does a comparison between original text and text currently stored in data for differences
   * as well as ensuring there actually IS text to store (avoids re-saving after deletion bug found earlier) <p>
   *
   * Updates interally stored text (for future reference) and value in database <p>
   *
   * @callback BulletEntry~editTextCallback
   * @param {blurEvent} event - provides access to element that stopped getting focused (for it's innerText)
   */

  /**
   * Removal triggers if backspace is pressed when either there is no input or input is just a single newline (handles a bug we found) <p>
   *
   * Removal starts with display - specifically removing child from div for containing children under this bullet.
   * Note that if a child bullet is removed with children (grand-children of current bullet) under it,
   * the grand-children will also disappear from display but will still exist in database and child's childID list
   * (not an issue since this childID will never be re-used) <p>
   *
   * Next the childID is used to remove from Database as well <p>
   *
   * Finally, the childIDs data is updated with the removal of the childID
   *
   * @callback BulletEntry~removeChildCallback
   * @param {keydownEvent} event - provides access to key that was clicked as well as element that event was triggered under
   */
  // ------------------------------------- End of Callback definitions -------------------------------------------------

  // ------------------------------------- Start of Helper definitions -------------------------------------------------
  /**
   * Stores Obj using id to database, optionally logging on success or fail
   * @param {Object[]} array of parameters passed into function
   * @param {string} array.id - ID to store under
   * @param {jsonObject} array.jsonData - Data to be stored
   * @param {bool} array.log - whether or not to log Success/Fail
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
      Database.fetch(childID, (data) => {
        if (data) {
          this.createChild(childID, data);
        } else {
          console.log(`Something went wrong when fetching data for child: ${childID}`);
        }
      });
    }
  }

  createChild (childID = generateID('bullet'), childData = {}) {
    const child = document.createElement('bullet-entry');
    child.data = [childID, childData];

    this.shadowRoot.querySelector('.bullet').appendChild(child);

    /**
     * Handles removal of a child bullet from display, database, and childIDs list under the right conditions
     * @param {BulletEntry~removeChildCallback} callback - Decides whether to remove and does so where needed
     *
     */
    child.shadowRoot.querySelector('.bullet-text').addEventListener('keydown', (event) => {
      if (event.key === 'Backspace' && (event.target.innerText.length === 0 || event.target.innerText === '\n')) {
        this.removeChild(child, childID);
      }
    });

    child.shadowRoot.querySelector('.bullet-remove').addEventListener('click', (event) => {
      this.removeChild(child, childID);
    });

    child.shadowRoot.querySelector('.bullet-text').focus();
  }

  removeChild (child, childID) {
    this.shadowRoot.querySelector('.bullet').removeChild(child);
    Database.delete(childID);
    this.data.childrenIDs = this.data.childrenIDs.filter(child => child !== childID);
  }
  // ------------------------------------- End of Helper definitions -------------------------------------------------
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