import { Database } from '../classes/database.js';

/**
 * This class contains a constructor, edit, and remove functions for the bullet custom HTML class
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
 * //Create a new bullet custom element using the object
 * let bullet = document.createElement('bullet-entry');
 * bullet.data = exampleBulletDay;
 * @property
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

        .bullet-entry {
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
      <link href="../css/all.css" rel="stylesheet"> <!--load all styles -->
      <div class="bullet">
        <button class="bullet-point"><i class="fas fa-circle"></i></button>
        <p class="bullet-text" contenteditable="true">holdonmmmmmm </p>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * @returns {string} JSON representation of data used to generate this bullet element
   */
  get data () {
    return this.getAttribute('data');
  }

  /**
   * Process for setting up data (mostly using shadowRoot)
   * 1. Sets root to top level element (by classname 'bullet')
   * 2. Sets text to element containing text (by classname 'text')
   *   a. Edit bullet text with a click eventListener, delegating to @method editBullet
   * 3. Sets remove to element closing bullet (by classname 'remove')
   *   a. Remove bullet with a click eventListener, delegating to @method deleteBullet
   * 4. Saves data used to setup bullet in an attribute named data
   *
   * To be implemented:
   * - Update the type of bullet point based off value
   *
   * @param {[string, jsonObject]} - [bulletID, data for generating this bullet element]
   */
  set data ([id, jsonData]) {
    console.log('Setter called');
    const root = this.shadowRoot.querySelector('.bullet');
    const text = root.querySelector('.bullet-text');
    // const remove = root.querySelector('.remove');

    root.id = id;
    text.innerText = jsonData.text;

    text.addEventListener('click', (event) => { this.editBullet(event); });
    // remove.addEventListener('click', (event) => { this.deleteBullet(event); });

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

    this.setAttribute('data', JSON.stringify(jsonData));
    Database.store(id, jsonData, ()=> {console.log(`Stored new bullet ${id} to database`)});
  }

  /**
   * Process for editing an existing bullet-entry element.
   * Triggers onClick for element containing bullet-entry text.
   * Process consists of:
   * 1. Checking that editting is enabled
   * 2. Creating and prepending an input textbox with value set to current text in bullet-entry element
   * 3. Hiding the current text of the bullet-element
   * 4. Disabling editting (until user finishes modifying bullet)
   * 5. Focusing user's input to the new input textbox
   * 6. Listening to input textbox for the 'Enter' key
   *   a. Triggers the replacement of the input textbox with the bullet-element's text (updated with input values)
   *   b. Re-enabling editting
   *
   * To be implemented:
   * - Update the database with modified bullet data
   *
   * @param {OnClickEvent} event - provides context for editting the bullet-entry element
   */
  editBullet (event) {
    console.log('Editing bullet');
    if (window.editable) {
      const target = event.target;

      const input = document.createElement('input');
      input.value = target.innerText;
      input.id = 'newBullet';

      target.parentElement.prepend(input);
      target.style.display = 'none';
      window.editable = false;

      input.focus();

      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          target.innerText = input.value;
          target.style.display = 'block';

          input.remove();
          window.editable = true;
        }
        // TODO: update the data on DB
      });
    }
  }

  /**
   * Deletes the bullet entry.
   *
   * To be implemented:
   * - Removes the bulletID from anything using it
   * - Update the database with this bullet removal
   *
   * @param {OnClickEvent} event - provides context for deleting the bullet-entry element
   */
  deleteBullet (event) {
    this.remove();
    // TODO: remove this bulletID from anything that uses it
    // TODO: update the data on DB
  }
}

/** Define a custom element for the BulletEntry web component */
customElements.define('bullet-entry', BulletEntry);

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
/** Example data
 * --------------
 *  "B 210515 00 00": {
        "labelIDs": [],
        "text": "Walk the dog",
        "value": -1,
        "childrenIDs": []
    },
    "B 2105 00": {
        "labelIDs": [],
        "text": "Ate even more hot dogs",
        "value": -1,
        "childrenIDs": []
    },
    "B 21 1 00": {
        "labelIDs": [],
        "text": "Learn French",
        "value": 0,
        "childrenIDs": []
    },
 */
