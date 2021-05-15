// Load jQuery for cool effects :D
let script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-latest.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Define variables used throughout all code here
// ----------------------------------------------

// Elements on all pages 
var body, btnMenu, btnZoomOut, btnHelp, btnPrevYear, btnNextYear, btnAddSection, currPage;
var editable = true;

// Elements for the daily logs page
var divDaily, sctReminders, sctDTrackers, sctLogs, sctSections;

// Elements for the monthly logs page
var divMonthly, sctCalendar, sctMNotes, sctMTrackers;

// Elements for the yearly logs page
var divYearlyIcons, divYearly, sctMonths, sctGoals, sctYNotes;

var noteScts;
// -----------------------------------------------
// End of variable definition

// Wait for document to load before loading up vars
document.addEventListener('DOMContentLoaded', loadVars);

// Handle history changes
window.onpopstate = function(event) {
    finalizeInputs();
    console.log('Current state.log: '+event.state.view);
    switch(event.state.view){
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

function loadVars() {
    body        = document.querySelector('body');
    btnMenu     = document.getElementById('menu-button');
    btnZoomOut  = document.getElementById('zoom-out-button');
    btnHelp     = document.getElementById('help-button');
    btnPrevYear = document.getElementById('prev-year-button');
    btnNextYear = document.getElementById('next-year-button');
    currPage    = 'daily';

    divDaily        = document.getElementsByClassName('daily')[0];
    divMonthly      = document.getElementsByClassName('monthly')[0];
    divYearly       = document.getElementsByClassName('yearly')[0];
    divYearlyIcons  = document.getElementsByClassName('icons-for-yearly')[0];
    
    btnAddSection   = document.getElementById('related-sections-button');
    sctLogs     = document.getElementById('daily-log');

    noteScts = document.getElementsByClassName('notes');
    window.history.pushState({view:'day'}, 'Daily Log', '#daily');
    loadDaily();

    // Let user edit existing bullets by adding an onClick to each <li> item
    document.querySelectorAll('li').forEach((listItem) => {
        listItem.addEventListener('click', (event) => {editBullet(event)});
    })

    // set any element that needs notes to "note" class (added to HTML)
    // select all of those, and add click listeners that trigger a helper function
    for(let i = 0; i<noteScts.length; i++){
        let btnAdd = document.createElement('button');
        btnAdd.innerText = "+";
        btnAdd.addEventListener('click', (event) => {addBullet(event)});
        noteScts[i].appendChild(btnAdd);
    }
    /*
    noteScts.forEach((sect) => {
        sect.addEventListener('click', (event) => {addBullet(event)});
    })
    */
    btnZoomOut.addEventListener('click', zoomOut);
    btnAddSection.addEventListener('click', createSection);
}

/**  Helper function to create new Bullet
 *    when section is clicked on (but not cliked on a bullet), appendChild(input box) 
 *    when input box is changed, create new list element, add eventListener(click, edit) to it,
 *    replace input box with new list element.  
 */


function addBullet(event){
    if (editable == true){
        let target = event.target.parentElement;
        console.log(target.innerHTML);
        let newBullet = document.createElement('li');
        let input = document.createElement('input');
        input.id = "newBullet";

        newBullet.appendChild(input);
        target.replaceChild(newBullet, event.target);
        input.focus();
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter'){
                let result = document.createElement('li');
                result.innerHTML = input.value + '\n';

                result.addEventListener('click', editBullet);
                target.replaceChild(result, newBullet);
                editable = true;
            }
        });
        target.appendChild(event.target);
        editable = false;
    }
}




/** Helper function to allow user to edit existing bullets
 * 
 * 1. Check that callingTarget = currentTarget (avoid doing all this logic twice for nested <li>s)
 * 2. Log the current target so we know what we're dealing with
 * 3. Create an <input> HTML Element and set it's value equal to whatever's in target rn
 *      a. When the user is done (changed and press Enter) editing:
 *          1. Log to console (debug purposes)
 *          2. create a new element and set innerHTML equal to input's value with newline (to account for children)
 *          3. clone the target (we'll use its children later)
 *          4. Add an eventListener to the newly created 'result' so IT can also be editted
 *          5. Go to parent element and replace 'target' with 'result'
 *          3. Iterate through all children other than first (original text)
 *              a. append each child in cloned target to current 'result' <li> element
 *              b. add an eventlistener to each child THAT IS A LIST ELEMENT
 *          7. Set `editable` back to true so user can edit other bullets
 */
function editBullet(event) {
    if (event.target.innerText == event.currentTarget.innerText && editable) {
        let target = event.target;
        // console.log(JSON.stringify(target.innerHTML));
        let input = document.createElement('input');
        input.value = target.innerText.split('\n')[0];
        input.id = "newBullet";

        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter'){
                inputToBullet(input, target);
            }
        });

        target.innerHTML = '<input>' + target.innerHTML.split('\n').slice(1).join('\n');
        console.log(JSON.stringify(target.innerHTML));
        target.replaceChild(input, target.children[0]);
        input.focus();

        editable = false;
    } else {
        console.log('event.target is ' + event.target.innerHTML);
        console.log('event.currentTarget is ' + event.currentTarget.innerHTML);
        console.log('editable is ' + editable);
    }
}

function finalizeInputs(){
    let input = document.getElementById('newBullet');
    if (input){
        inputToBullet(input, input.parentElement);
    }
}

function inputToBullet(input, target){
    //console.log('You pressed submit');
    let result = document.createElement('li');
    result.innerHTML = input.value + '\n';

    let cloneTarget = target.cloneNode(true);
    
    result.addEventListener('click', editBullet);
    target.parentElement.replaceChild(result, target);
    //console.log('Target after replace is ' + target.innerHTML);

    let children = cloneTarget.children;
    for (let i = 1; i < children.length; i++) {
        //console.log("adding eventlistener to " + cloneTarget.children[i].innerHTML);
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
function zoomOut() {
    finalizeInputs();
    console.log("You clicked on the zoom out button");
    switch (currPage) {
        case 'daily':
            window.history.pushState({view:'month'}, 'Monthly Log', '#month');
            transitionMonthly();
            break;
        case 'monthly':
            window.history.pushState({view:'year'}, 'Yearly Log', '#year');
            transitionYearly();
            break;
    }
}

function transitionDaily() {
    divDaily.style.display = 'block';
    divMonthly.style.display = 'none';

    currPage = 'daily';
}

function transitionMonthly() {
    divDaily.style.display = 'none';
    divMonthly.style.display = 'block';
    divYearly.style.display = 'none';

    divYearlyIcons.style.display = 'none';
    btnZoomOut.style.display = 'block';

    currPage = 'monthly';
}

function transitionYearly() {
    divMonthly.style.display = 'none';
    divYearly.style.display = 'block';

    divYearlyIcons.style.display = 'block';
    btnZoomOut.style.display = 'none';

    currPage = 'yearly';
}
// -------------------------------------------------------
// Finished adding functionality to zoom-out button

// Loading buttons for different views
function loadDaily() {
    document.getElementById('minimize-section').addEventListener('click', () => {
        $('ol').slideToggle();
    });
}

function loadMonthly() {
}

function loadYearly() {

}
    
function createSection(){
    console.log("You clicked on the create section button");
    let newSection = document.createElement('daily');
    // Element.appendChild((create ))
    
}
//Notes 
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