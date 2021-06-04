import { labels } from '../scripts/script.js';
import { Database } from './database.js';
// import { labels } from '../scripts/script.js';

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
      type: 'task-bullet',
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
 * @property {string} data.type - string describing type of bullet (e.g. 'task-bullet', 'notes-bullet', etc)
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
          padding-top: .8vh;
        }

        div < div.bullet-remove {
          color: transparent;
        }
        
        .bullet-point:hover {
          font-size: 12px;
          position: relative;
          padding-top: .7vh;
          right: 1px;
          width: 22px;
        }
        
        .bullet-text {
          display: inline-block;
          width: 70%;
          font-size: larger;
          margin: 0;
          /* border: 5px solid black; */
        
          padding-left: .5vw;
        }
        
        .bullet {
          margin-left: 1vw;
          padding-left: .5vw;
          background-color: white;
        }
        
        .bullet:hover {
          filter: brightness(96%);
          border-radius: 20px;
        }
        
        .bullet:hover .bullet-remove,
        .bullet:hover .child-add,
        .bullet:hover .label-add,
        .bullet:hover .label {
          color: black;
        }
        
        .child-add {
          float: left;
          max-width: 1vw;
        }

        .bullet-remove {
          float: right;
          padding-right: .8vw;
        }

        .label-add,
        .label {
          float: right;
        }
        
        .child-add:hover,
        .bullet-remove:hover,
        .label:hover {
          font-size: 15px;
          position: relative;
          padding-top: .5vh;
        }
        
        .label-add:hover {
          font-size: 0.9em;
          position: relative;
          padding-top: .5vh;
        }

        .fa-stack { font-size: 0.5em; }
        i { vertical-align: middle; }

        .label,
        .child-add,
        .label-add,
        .bullet-remove {
          padding-top: .6vh;

          color: transparent;
        
          border: none;
          background-color: transparent;
        }
        
        [contenteditable] {
          outline: 0px solid transparent;
        }

        .irrelevant {
          text-decoration: line-through;
        }

      </style>
      
      <link href="../assets/css/all.css" rel="stylesheet"> <!--load all styles -->

      <div class="bullet">         
        <button class="child-add"><i class="fas fa-level-up-alt fa-rotate-90"></i></button>    
        <button class="bullet-point"><i class="fas fa-circle"></i></button>
        <button class="bullet-remove"><i class="fas fa-times"></i></button>
        <button class="label-add">
          <span class="fa-stack fa-2x" style="font-size:0.7em;">
            <i class="fas fa-bookmark fa-stack-2x"></i>
            <i class="fas fa-plus fa-stack-1x fa-inverse" style="position: relative; top: -10%;"></i>
        </span>
        </button>
        
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
   *   type: string <p>
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
   * Adds a listener to the bullet icon to allow user to open bullet type menu on right click and
   * choose a new type of bullet from that menu <p>
   *
   * @param {Array.<{id: string, jsonData: Object, incrementBullet: callback}>} data - [ID, data] pair used to create, load, and store bullet data to and from DB. [callback] used to generateID and increment bullet counter when creating children
   */
  set data ([id, jsonData, newBulletID]) {
    console.log('Setter called');

    if (Object.entries(jsonData).length === 0) {
      jsonData = {
        labelIDs: [],
        text: '',
        type: 'task-bullet',
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

    // Iterates through labelIDs and sets display with each label
    this.setLabels();

    /** Adding an event listener to the bullet-point itself for custom contextmenu (dropdown) for selecting type of bullet
     * Custom bullet menu toggle on
     * turns off default context menu
     * adds active class to custom context menu on right click to bullet-point
     * adds event listeners to each option to apply the correct new icon and update the data when the user selects a new type of bullet
     */

    // html elements that will be needed for displaying the dropdown and adding event listeners
    const contextMenu = document.querySelector('#context-menu');
    const bulletOptions = document.querySelectorAll('.bullet-option');
    const bulletIcon = this.shadowRoot.querySelector('.bullet-point > i');

    const labelMenu = document.querySelector('#label-menu');
    const labelOptions = document.querySelectorAll('.label-option');

    this.shadowRoot.querySelector('.bullet-point').addEventListener('contextmenu', (event) => {
      // display custom dropdown with the bullet types
      event.preventDefault();
      const x = event.pageX + 'px';
      const y = event.pageY + 'px';
      contextMenu.style.top = y;
      contextMenu.style.left = x;
      contextMenu.classList.add('active'); // adds the active class to the contextmenu so it gets displayed

      // loop through each option in the dropdown and add a click event listener for when the user selects an option
      for (const bulletOption of bulletOptions) {
        bulletOption.onclick = (event) => {
          // get the icon that the user selected
          const option = event.target.closest('.bullet-option');
          const optionIcon = option.querySelector('i');

          // check if the selected icon is different from the current icon (if it isn't, we don't have to update anything)
          if (bulletIcon.className !== optionIcon.className) {
            // update the current bullet icon with selected icon's class name in order to update the displayed icon
            bulletIcon.className = optionIcon.className;

            // add the strikethrough style if the user selects irrelevant bullet
            if (optionIcon.id === 'irrelevant-bullet') {
              bulletText.classList.add('irrelevant');
            } else {
              bulletText.classList.remove('irrelevant');
            }

            // update the bullet object's data and store the updated data in the database
            // the bullet type is given by the id of the icon selected by the user (e.g. 'task-bullet', 'notes-bullet', etc)
            jsonData.type = optionIcon.id;
            this.setAttribute('data', JSON.stringify(jsonData));
            this.storeToDatabase(id, jsonData, true);
          }
        };
      }
    });

    /** Add an Event Listener to the "Add-Label" for a custom contextmenu (dropdown) for selecting labels to apply
     * Custom label menu toggle on
     * Turns off default context menu
     * Adds active class to custom context menu onClick to "Add-Label"
     */
    this.shadowRoot.querySelector('.label-add').addEventListener('click', (event) => {
      setTimeout(() => {
        const x = event.pageX + 'px';
        const y = event.pageY + 'px';
        labelMenu.style.top = y;
        labelMenu.style.left = x;
        labelMenu.classList.add('active');
      }, 1);

      // loop through each option in the dropdown and add a click event listener for when the user selects an option
      for (const labelOption of labelOptions) {
        /**
         * Handles for the addition of a NEW label
         * @param {BulletEntry~addLabelCallback} callback - Creates NEW label and updates data (parent and database)
         */
        labelOption.onclick = (event) => {
          const labelID = event.target.closest('.label-option').id;

          if (!this.data.labelIDs.includes(labelID)) {
            const data = this.data;
            data.labelIDs.push(labelID);
            this.setAttribute('data', JSON.stringify(data));
            this.storeToDatabase(id, data, true);

            this.createLabel(labelID);
          }
        };
      }
    });

    /** Event Listener for any click on the window
     * This will remove the 'active' class from our contextmenu so it auto closes
     */
    window.addEventListener('click', (event) => {
      contextMenu.classList.remove('active');
      labelMenu.classList.remove('active');
    });

    /** Bullet icon displayed based on the type in the bullet data
     * This will update the bullet icon with the class name given by the bullet type stored in the json data
     * Also adds the strikethrough styling to the bullet text if the bullet is an irrelevant bullet type
     */
    bulletIcon.className = document.querySelector(`#${jsonData.type}`).className;
    if (jsonData.type === 'irrelevant-bullet') {
      bulletText.classList.add('irrelevant');
    }

    /**
     * Handles saving changes to bullet text to internal data and database under the right conditions
     * @param {BulletEntry~editTextCallback} callback - Decides whether to update data and does so where needed
     */
    bulletText.addEventListener('blur', (event) => {
      if ((bulletText.innerText || bulletText.innerText === '') && bulletText.innerText !== this.data.text) {
        if (bulletText.innerText !== '\n') {
          jsonData.text = bulletText.innerText;
        } else {
          jsonData.text = '';
        }
        this.setAttribute('data', JSON.stringify(jsonData));
        this.storeToDatabase(id, jsonData, true);
      }
    });

    /**
     * Handles for the addition of a NEW child
     * @param {BulletEntry~addChildBullet} callback - Creates NEW child and updates data (parent and database)
     */
    this.shadowRoot.querySelector('.child-add').addEventListener('click', () => {
      const childID = newBulletID();

      jsonData.childrenIDs.push(childID);
      this.setAttribute('data', JSON.stringify(jsonData));
      this.storeToDatabase(id, jsonData, true);

      this.createChild(childID, {}, newBulletID);
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
   * Handles the process for creating a NEW label <p>
   *
   * Grabs the name (ID) of the label from the id of the selected option <p>
   *
   * Updates data (both parent and database) with new label (ID) <p>
   *
   * Calls on helper function for generating and displaying the label
   *
   * @callback BulletEntry~addLabelCallback
   * @param {onClickEvent} event - provides access to the option that the user selected
   */

  /**
   * Removal triggered by clicking on the label <p>
   *
   * Removal starts with display, the element representing the label is removed from div <p>
   *
   * labelID is used to remove from Database as well <p>
   *
   * Finally, the labelIDs data is updated with the removal of the labelID
   *
   * @callback BulletEntry~removeLabelCallback
   * @param {onClickEvent} event - provides access to the element that contains the label to remove
   */

  /**
   * Handles the process for creating a NEW bullet <p>
   *
   * Performs generation of an ID via the passed in callback (which also updates calling section's newBulNum) <p>
   *
   * Updates data (both parent and database) with new child (ID) <p>
   *
   * Calls on helper function for generating the child bullet element
   *
   * @callback BulletEntry~addChildBullet
   * @param {onClickEvent} event - provides access to parent to append child bullet to
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
   * Handles the creation, appending, and deletion of EXISTING children <p>
   *
   * Iterates through each childID in data: <p>
   *
   * 1. Creates a new bullet-entry element <p>
   *
   * 2. Fetches data and calls on helper function for child creation
   *
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

  /**
   * Handles the creation and appending to display of a child bullet, and potential deletion of children <p>
   *
   * Called for both creation of new and existing children (based off whether param is empty jsonObj or not) <p>
   *
   * Creation and data setting handled by the bullet-element methods. Appends child under appropriate div in current bullet element <p>
   *
   * Special definitions for removal of a child bullet (both through buttons and backspacing empty content) <p>
   *
   * Finally, focused after creation for immediate text input
   *
   * @param {string} childID - ID used to retrieve (existing) / store (new) child bullet element
   * @param {jsonObject} childData - used to store child bullet's data (empty for new)
   * @param {function} callback - used to generate IDs for potential children
   */
  createChild (childID, childData = {}, callback) {
    const child = document.createElement('bullet-entry');
    child.data = [childID, childData, callback];

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

  /**
   * Handles removal of a child from display, parent data, and database
   *
   * @param {HTMLElement} child - reference to child bullet's html element
   * @param {string} childID - used to remove from childIDs list in parent and from database
   */
  removeChild (child, childID) {
    this.shadowRoot.querySelector('.bullet').removeChild(child);

    const data = this.data;
    data.childrenIDs = data.childrenIDs.filter(child => child !== childID);
    this.setAttribute('data', JSON.stringify(data));
    this.storeToDatabase(this.id, data);

    Database.delete(childID);
  }

  /**
   * Handles the creation, appending, and deletion of EXISTING labels <p>
   *
   * Iterates through each labelID in data and call a helper function to generate each label
   */
  setLabels () {
    for (const labelID of this.data.labelIDs) {
      this.createLabel(labelID);
    }
  }

  /**
   * Handles the creation and display of a new label <p>
   *
   * Called for creation of both new and existing labels <p>
   *
   * Data setting handled in a layer above (if needed at all) <p>
   *
   * Special click listeners added to allow for removal of a label (calls a helper function for deletion)
   *
   * @param {string} labelName - used to figure out what color the label should be
   */
  createLabel (labelName) {
    // Create button and set attributes (for CSS and other logic) + apply a tooltip (on hoever, show labelName)
    const button = document.createElement('button');
    button.className = 'label';
    button.id = labelName;
    $(button).tooltip();
    button.title = labelName;

    // Create icon that will go inside the button (image of the lable), color based off labelName and labels (from script!)
    const icon = document.createElement('i');
    icon.className = 'fas fa-bookmark';
    icon.style.color = labels[labelName].color;

    // Nest the icon inside the button for a complete label
    button.appendChild(icon);

    /**
     * Handles removal of a label from display, database, and childIDs (triggered by clicking on the label)
     * @param {BulletEntry~removeLabelCallback} callback - Decides whether to remove and does so where needed
     *
     */
    button.onclick = (event) => {
      this.removeLabel(button, labelName);
    };

    /** Figure out where to insert the newly created label
     * 1. Check if there are no other labels, append to far left
     * 2. Otherwise iterate through labels until new label > existing label (at index)
     *   a. insertBefore will place label to right of existing label
     * 3. Finally if the label is < all existing labels
     *   a. insertBefore to the far left
     *
     * End result: Labels displayed by name A-Z
     */
    const bullet = this.shadowRoot.querySelector('.bullet');
    const labelElems = bullet.querySelectorAll('.label');
    if (!labelElems.length) {
      bullet.insertBefore(button, bullet.querySelector('.bullet-text'));
    } else {
      for (let i = 0; i < labelElems.length; i++) {
        if (labelName > labelElems[i].id) {
          bullet.insertBefore(button, labelElems[i]);
        } else if (i === labelElems.length - 1) {
          bullet.insertBefore(button, bullet.querySelector('.bullet-text'));
        }
      }
    }
  }

  /**
   * Handles removal of a label from display, parent data, and database
   *
   * @param {HTMLElement} label - reference to element representing the label itself
   * @param {string} labelID - used to remove from labelIDs list in parent and from database
   */
  removeLabel (label, labelID) {
    this.shadowRoot.querySelector('.bullet').removeChild(label);

    const data = this.data;
    data.labelIDs = data.labelIDs.filter(label => label !== labelID);
    this.setAttribute('data', JSON.stringify(data));
    this.storeToDatabase(this.id, data);
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
      type: 'task-bullet',
      childrenIDs: []
    }
  ];

  const exampleBulletMonth = [
    'B 2105 00',
    {
      labelIDs: [],
      text: 'Walk the dog',
      type: 'task-bullet',
      childrenIDs: []
    }
  ];

  const exampleBulletYear = [
    'B 21 1 00',
    {
      labelIDs: [],
      text: 'Walk the dog',
      type: 'task-bullet'
    }
  ];
 */
