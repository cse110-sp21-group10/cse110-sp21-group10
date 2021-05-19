// Load jQuery for cool effects :D
const script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-latest.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Define variables used throughout all code here
// ----------------------------------------------

// Boolean to toggle editability
let editable = true;

// Elements and buttons found on all pages
let btnZoomOut, btnAddSection;

// Elements for the daily logs page
let divDaily;

// Elements for the monthly logs page
let divMonthly;

// Elements for the yearly logs page
let divYearlyIcons, divYearly;

// Array to store all sections that will have bullet points
let noteScts;
// -----------------------------------------------
// End of variable definition

/**
 * Wait for DOM to load before running script
 * @param {script.setupScript} cb - Callback that uses DOM content to setup script
 */
document.addEventListener('DOMContentLoaded', setupScript);

/**
 * Handles url navigation via the back/forward buttons
 * @param {PopStateEvent} event - info on target page contained in state
 * - Will finalize any user input
 * - Will log target view
 * - Will transition to target day
 */
window.onpopstate = function (event) {
  finalizeInputs();
  console.log('Current state.log: ' + event.state.view);
  switch (event.state.view) {
    case 'day':
      transitionDaily();
      break;
    case 'month':
      transitionMonthly();
      break;
    case 'year':
      transitionYearly();
      break;
  }
};

/**
 * Helper called once DOM has loaded
 * @callback script.setupScript
 * - Will load values into all declared variables
 * - Will update page to Daily Log view
 * - Will set up buttons
 */
function setupScript () {
  window.history.pushState({ view: 'day' }, 'Daily Log', '#daily');

  loadVars();
  loadDaily();
  setupButtons();
}

/** Values assigned to variables defined earlier - either default or loaded from DOM */
function loadVars () {
  divDaily = document.getElementsByClassName('daily')[0];
  divMonthly = document.getElementsByClassName('monthly')[0];
  divYearly = document.getElementsByClassName('yearly')[0];
  divYearlyIcons = document.getElementsByClassName('icons-for-yearly')[0];

  btnZoomOut = document.getElementById('zoom-out-button');
  btnAddSection = document.getElementById('related-sections-button');

  noteScts = document.getElementsByClassName('notes');
}

/**
 * Functionality applied to the following buttons:
 * - ZoomOut Button (magnifying glass)
 * - Bullet item (represented by li elements for now)
 * - Section body (button created to add a new note/bullet)
 * - Add Section Button
 */
function setupButtons () {
  btnZoomOut.addEventListener('click', zoomOut);

  document.querySelectorAll('li').forEach((listItem) => {
    listItem.addEventListener('click', (event) => { editBullet(event); });
  });

  for (let i = 0; i < noteScts.length; i++) {
    const btnAdd = document.createElement('button');
    btnAdd.innerText = '+';
    btnAdd.addEventListener('click', (event) => { addBullet(event); });
    noteScts[i].appendChild(btnAdd);
  }

  btnAddSection.addEventListener('click', createSection);
}

/**
 * Creates a new bullet under target's parent (button's section) that triggered event
 * @param {OnClickEvent} event
 * - Function only run if editting is enable
 * - New list item with input textbox appended to parent section (user directed to inside input)
 * - Editing is disabled
 * - Input box triggers action upon reading 'Enter':
 *  - Textbox value used to create new list item
 *  - New list item replaces the 'input' list item
 *  - Editing is enabled
 */
function addBullet (event) {
  if (editable === true) {
    const parent = event.target.parentElement;
    // console.log(target.innerHTML);

    const newBullet = document.createElement('li');
    const input = document.createElement('input');
    input.id = 'newBullet';

    newBullet.appendChild(input);
    parent.replaceChild(newBullet, event.target);
    input.focus();

    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const result = document.createElement('li');
        result.innerHTML = input.value + '\n';

        result.addEventListener('click', editBullet);
        parent.replaceChild(result, newBullet);
        editable = true;
      }
    });

    parent.appendChild(event.target);
    editable = false;
  }
}

/**
 * Edits existing bullet when clicked on
 * @param {OnClickEvent} event
 * - Function only runs if editting is enabled AND only for the list item clicked (for nested list items)
 * - Input textbox created with value of first line of list item (in case list item has children)
 *  - Texbox replaces first child of list item (again in case list item has children) and user is directed inside textbox
 * - Editing is disabled
 * - Input box triggers helper funciton upon reading 'Enter':
 *  - Editing will be enabled within
 */
function editBullet (event) {
  if (editable && event.target.innerText === event.currentTarget.innerText) {
    const target = event.target;
    // console.log(JSON.stringify(target.innerHTML));

    const input = document.createElement('input');
    input.value = target.innerText.split('\n')[0];
    input.id = 'newBullet';

    target.innerHTML = '<input>' + target.innerHTML.split('\n').slice(1).join('\n');
    // console.log(JSON.stringify(target.innerHTML));
    target.replaceChild(input, target.children[0]);
    input.focus();

    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        inputToBullet(input, target);
      }
    });

    editable = false;
  }
}

/** Finds any open inputs and finalizes the process of transforming inputs to bullets */
function finalizeInputs () {
  const input = document.getElementById('newBullet');
  if (input) {
    inputToBullet(input, input.parentElement);
  }
}

/**
 *
 * @param {*} input 
 * @param {*} target 
 */
function inputToBullet (input, target) {
  // console.log('You pressed submit');
  const result = document.createElement('li');
  result.innerHTML = input.value + '\n';

  const cloneTarget = target.cloneNode(true);

  result.addEventListener('click', editBullet);
  target.parentElement.replaceChild(result, target);
  // console.log('Target after replace is ' + target.innerHTML);

  const children = cloneTarget.children;
  for (let i = 1; i < children.length; i++) {
    // console.log("adding eventlistener to " + cloneTarget.children[i].innerHTML);
    children[i].querySelectorAll('li').forEach((listItem) => {
      listItem.addEventListener('click', editBullet);
    });
    result.append(children[i]);
  }

  editable = true;
}

/** Working with Local Storage
 * ----------------------------
 * 1. Check localstorage
 * 2. load global variables
 * 3. onChange, update global variables
 * 4. when exiting, write to localstorage
 */

// Adding functionality to zoom-out button
// -------------------------------------------------------
function zoomOut () {
  finalizeInputs();
  console.log('You clicked on the zoom out button');
  switch (history.state.view) {
    case 'day':
      window.history.pushState({ view: 'month' }, 'Monthly Log', '#month');
      transitionMonthly();
      break;
    case 'month':
      window.history.pushState({ view: 'year' }, 'Yearly Log', '#year');
      transitionYearly();
      break;
  }
}

function transitionDaily () {
  divDaily.style.display = 'block';
  divMonthly.style.display = 'none';
}

function transitionMonthly () {
  divDaily.style.display = 'none';
  divMonthly.style.display = 'block';
  divYearly.style.display = 'none';

  divYearlyIcons.style.display = 'none';
  btnZoomOut.style.display = 'block';
}

function transitionYearly () {
  divMonthly.style.display = 'none';
  divYearly.style.display = 'block';

  divYearlyIcons.style.display = 'block';
  btnZoomOut.style.display = 'none';
}
// -------------------------------------------------------
// Finished adding functionality to zoom-out button

// Loading buttons for different views
function loadDaily () {
  document.getElementById('minimize-section').addEventListener('click', () => {
    $('ol').slideToggle();
  });
}

function loadMonthly () {
}

function loadYearly () {

}

function createSection () {
  console.log('You clicked on the create section button');
}

// Notes
/*

$(document).click(function(event) {
  var $target = $(event.target);
  if(!$target.closest('#menucontainer').length &&
  $('#menucontainer').is(":visible")) {
    $('#menucontainer').hide();
  }
});

*/
/*
// Old code for adding evenListeners to all 'li' items
document.querySelectorAll('li').forEach((listItem)=>{
    listItem.addEventListener('click', (event) => {
        let target = event.target;
        let input = document.createElement('input');
        input.value = target.innerText.split('\n')[0];

        input.addEventListener('submit', () => {
            let result = document.querySelector('')
            savedText.textContent = input;
        });

        target.innerHTML = '<input>'+target.innerHTML.split('\n').slice(1).join('');
        target.replaceChild(input, target.children[0]);
    })
})
*/

// sctLogs.addEventListener('click', ()=> {
//     let inputBox = document.createElement('input');
//     inputBox.type = 'text';
//     document.getElementById('daily-log').appendChild(inputBox);
// });
