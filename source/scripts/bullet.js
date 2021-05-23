import { Database } from '../classes/database.js'

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
        <input type="text" class="bullet-input" style="display: none;"> </input>
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
   * Process for setting up data (mostly using shadowRoot) <p>
   * 0. Checks if empty data is passed in, replaces data with an empty template instead <p>
   * 1. Sets root to top level element (by classname 'bullet') <p>
   * 2. Sets text to element containing text (by classname 'text') <p>
   *   a. Edit bullet text with a click eventListener, delegating to editBullet <p>
   * 3. Sets remove to element closing bullet (by classname 'remove') <p>
   *   a. Remove bullet with a click eventListener, delegating to deleteBullet <p>
   * 4. Saves data used to setup bullet in an attribute named data <p>
   * 5. Calls a function to  <p>
   * 
   * To be implemented: <p>
   * - Update the type of bullet point based off value
   *
   * @param {[string, jsonObject]} - [bulletID, data for generating this bullet element]
   */
  set data ([id, jsonData]) {
    console.log('Setter called');
    this.shadowRoot.querySelector('.bullet').setAttribute('id', id);

    if (Object.entries(jsonData).length === 0) {
      jsonData = {
          labelIDs: [],
          text: '',
          value: -1,
        childrenIDs: []
      };
      console.log(jsonData);
    }

    const text = this.shadowRoot.querySelector('.bullet-text');
    // const remove = root.querySelector('.remove');

    this.id = id;
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
    this.storeToDatabase(id, jsonData, true);
  }

  /**
   * Process for editing an existing bullet-entry element. <p>
   * Triggers onClick for element containing bullet-entry text. <p>
   * Process consists of: <p> 
   * 1. Checking that editting is enabled <p>
   * 2. Showing the hidden input textbox with value set to whatever's inside the current text <p>
   * 3. Hiding the current text of the bullet-element <p>
   * 4. Disabling editting (until user finishes modifying bullet) <p>
   * 5. Focusing user's input to the input textbox <p>
   * 6. Listening to input textbox for the 'Enter' key <p>
   *   a. Triggers the replacement of the input textbox with the bullet-element's text (updated with input values) <p>
   *   b. Re-enabling editting <p>
   * 7. Update the database with modified bullet data <p>
   *   a. Parses this bullet's data into JSON format <p>
   *   b. Updates the text with new value <p>
   *   c. Sets the data to the stringified version of the updated JSON <p>
   *   d. Calls the DB function to store this updated data to ID <p>
   * @param {OnClickEvent} event - provides context for editting the bullet-entry element
   */
  editBullet (event) {
    console.log('Editing bullet');

    const input = this.shadowRoot.querySelector('.bullet-input');

    if (window.editable) {
      const target = event.target;

      input.style.display = 'block';
      input.value = target.innerText;
      input.id = 'newBullet';

      target.style.display = 'none';
      window.editable = false;

      input.focus();

      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          target.innerText = input.value;
          target.style.display = 'block';

          input.style.display = 'none';
          window.editable = true;

          let jsonData = JSON.parse(this.data);
          jsonData.text = target.innerText;
          this.setAttribute('data', JSON.stringify(jsonData));
          this.storeToDatabase(this.id, jsonData, true);
        }
      });
    }
  }

  /**
   * Stores Obj using id to database, loggin if success or fail 
   */
  storeToDatabase (id, jsonData, log = false) {
    Database.store(id, jsonData, (success) => {
      if (log){
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
