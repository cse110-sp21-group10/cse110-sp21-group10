import { Database } from '../classes/database.js';

/**
 * Helper function to apply styles loaded from database
 *
 * @param {string} fontType - font to apply
 */
export function loadStyle (fontType) {
  document.body.style.fontFamily = fontType;
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
    let fontType;

    if (idName === 'verdana') {
      fontType = 'Verdana, sans-serif';
    }

    if (idName === 'default-font') {
      fontType = 'Times New Roman, serif';
    }

    if (idName === 'garamond') {
      fontType = 'Garamond, serif';
    }

    if (idName === 'courier-new') {
      fontType = 'Courier New, serif';
    }

    if (idName === 'helvetica') {
      fontType = 'Helvetica, sans-serif';
    }

    Database.store('S', { fontType: fontType });
    loadStyle(fontType);
  });
}

// Getting all possible theme setting
const themes = document.getElementsByClassName('theme-style');

/** This loop adds an event listener for changing the theme
 * If statements are used to determine which theme to switch to
 */
for (let i = 0; i < themes.length; i++) {
  themes[i].addEventListener('click', () => {
    const themeId = themes[i].id;
    let themeType;

    if (themeId === 'high-contrast') {
      themeType = 'high-contrast-mode';
    }

    if (themeId === 'default-theme') {
      themeType = '';
    }

    document.getElementsByTagName('html')[0].className = themeType;
  });
}
