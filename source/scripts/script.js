// Load 
let script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Define variables used throughout all code here

// variables found on any page
var body; 

// variables found on the template.html page
var zoomOutButton, menuButton, helpButton, prevYearButton, nextYearButton;

// variables found on the daily.html page
var reminders, dTrackers, dailyLog, sections;

// variables found on the monthly.html page
var calendar, mNotes, mTrackers;

// variables found on the yearly.html page
var months, yGoals, yNotes;

setTimeout(loadElements, 50);

/** Working with Local Storage
 * ----------------------------
 * 1. Check localstorage
 * 2. load global variables
 * 3. onChange, update global variables
 * 4. when exiting, write to localstorage
 */

// Give the page some time to load before grabbing all the elements
function loadElements() {
    loadTemplate();
}

// Set a click listener to all buttons once loaded
function setButtons(){
    /** Later on, we'll consolidate into a SPA
     *  and instead of redirections, we'll just have hash
     * */
    zoomOutButton.addEventListener('click', ()=>{
        window.location.href = '../HTML/monthly.html';
    });
}

function loadTemplate() {
    body = document.querySelector('body');
    zoomOutButton = document.getElementById('zoom-out-button');
    menuButton = document.getElementById('menu-button');
    helpButton = document.getElementById('help-button');

    prevYearButton = document.getElementById('prev-year-button');
    nextYearButton = document.getElementById('next-year-button');

    setButtons();
}

function loadDaily() {
    document.getElementById('minimize-section').addEventListener('click', ()=> {
        $('ol').slideToggle();
    });
}

function loadMonthly() {
}

function loadYearly() {

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