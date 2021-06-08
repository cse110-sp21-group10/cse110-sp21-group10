import { Database } from '../classes/database.js';

/**
 * Helper function to apply styles loaded from database
 *
 * @param {string} fontType - font to apply
 */
export function loadStyle (fontType) {
  document.body.style.fontFamily = fontType;

  const dailyHeader = document.querySelector('daily-log').shadowRoot.querySelector('#daily-header > h1');
  dailyHeader.style.fontFamily = fontType;

  /** eventually won't need this loop because we'll
       * need to access the monthly and yearly elements thru
       * their shadow roots
       */
  const headers = document.querySelectorAll('h1');
  for (let i = 0; i < headers.length; i++) {
    headers[i].style.fontFamily = fontType;
    console.log(headers[i].content);
  }
}

/* Getter for the Hamburger menu button */
const indexBtn = document.getElementById('menu-button');

/* Getter for the Index div */
const indexEl = document.getElementById('index');

/* Getter for the 'Font' div */
// eslint-disable-next-line no-unused-vars
const fontBtn = document.getElementById('font-setting');

/* Getter for the 'Theme' div */
// eslint-disable-next-line no-unused-vars
const themeBtn = document.getElementById('theme-setting');

/* Getter for the 'X' button */
const indexCloseBtn = document.getElementById('close-index');

// TODO: Figure out how to change header font
//       Customize font sizes

/* Adds functionality to the hamburger menu icon to open the index */
indexBtn.addEventListener('click', () => {
  indexEl.classList.toggle('active');
});

/* Adds functionality to the 'X' icon to close the index */
indexCloseBtn.addEventListener('click', () => {
  indexEl.classList.toggle('active');
});

// This is what creates the collapsible menus for Font and Themes
const coll = document.getElementsByClassName('collapsible');
let i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function () {
    this.classList.toggle('active');
    const content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
}

// Getting all of the possible font selections
const fonts = document.getElementsByClassName('font-style');

/** This loop adds an event listener for changing the font
 * If statements are used to determine which font to switch to
 */
for (let i = 0; i < fonts.length; i++) {
  fonts[i].addEventListener('click', () => {
    const idName = fonts[i].id;
    // console.log(i + ": " + fonts[i].id);
    let fontType, headerType;

    if (idName === 'verdana') {
      fontType = 'Verdana, sans-serif';
    }

    if (idName === 'default-font') {
      fontType = 'Times New Roman, serif';
      headerType = 'Kaushan Script, cursive';
    }

    if (idName === 'garamond') {
      fontType = 'Garamond, serif';
    }

    if (idName === 'courier-new') {
      headerType = fontType = 'Courier New, serif';
    }

    if (idName === 'helvetica') {
      headerType = fontType = 'Helvetica, sans-serif';
    }

    Database.store('S', { fontType: fontType });
    loadStyle(fontType);
    console.log('Not actually using ' + headerType + ' for now :0');
  });
}

/** Changing the display to be in dark mode
  * TODO: Figure out why the header color will change, but not the contents of bullets
  * TODO: Only change the necessary icons:
  *       might need to add another class to the icons that will change
  */
// const darkModeBtn = document.getElementById('dark-mode');
// darkModeBtn.addEventListener('click', () => {
//   console.log("theme changing? - isn't done yet");
//   document.body.style.color = 'white';
//   document.body.style.backgroundColor = 'black';

//   const icons = document.querySelectorAll('button');
//   for (let i = 0; i < icons.length; i++) {
//     icons[i].style.color = 'white';
//   }
// });
