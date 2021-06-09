import { Database } from '../classes/database.js';

// Declaring fontType and themeType defaults prior to setting them onClick (export allows other scripts to set them)
export const style = {
  fontType: 'Times New Roman, serif',
  themeType: ''
};

/**
 * Helper function to apply styles loaded from database
 *
 * @param {string} fontType - font to apply
 * @param {string} themeType - theme to apply
 */
export function loadStyle () {
  document.body.style.fontFamily = style.fontType;
  document.getElementsByTagName('html')[0].className = style.themeType;
  // document.querySelector('daily-log').shadowRoot.querySelector('img').src = style.newSrc;
}

/* Getter for the Hamburger menu button */
const indexBtn = document.getElementById('menu-button');

/* Getter for the Index div */
const indexEl = document.getElementById('index');

/* Getter for the 'X' button */
const indexCloseBtn = document.getElementById('close-index');

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

    if (idName === 'verdana') {
      style.fontType = 'Verdana, sans-serif';
    }

    if (idName === 'default-font') {
      style.fontType = 'Times New Roman, serif';
    }

    if (idName === 'garamond') {
      style.fontType = 'Garamond, serif';
    }

    if (idName === 'courier-new') {
      style.fontType = 'Courier New, serif';
    }

    if (idName === 'helvetica') {
      style.fontType = 'Helvetica, sans-serif';
    }

    Database.store('S', { fontType: style.fontType, themeType: style.themeType });
    loadStyle();
  });
}

// Getting all possible theme setting
const themes = document.getElementsByClassName('theme-style');
// console.log(document.querySelector('daily-log').shadowRoot.querySelector('img').getAttribute('src'));

/** This loop adds an event listener for changing the theme
 * If statements are used to determine which theme to switch to
 */
for (let i = 0; i < themes.length; i++) {
  themes[i].addEventListener('click', () => {
    const themeId = themes[i].id;
    const weatherImg = document.querySelector('daily-log').shadowRoot.querySelector('img');
    const weatherImgSrc = weatherImg.getAttribute('src');
    let subtract = 4;

    if (weatherImgSrc.includes('_d')) {
      subtract = 6;
    }

    const total = weatherImgSrc.length - subtract;
    let newSrc = weatherImgSrc.substr(0, total);
    console.log('original: ' + weatherImgSrc);

    if (themeId === 'high-contrast') {
      style.themeType = 'high-contrast-mode';
      newSrc += '_d.png';
    }

    if (themeId === 'solarized-dark') {
      style.themeType = 'solarized-dark-mode';
      newSrc += '_d.png';
    }

    if (themeId === 'default-theme') {
      style.themeType = '';
      newSrc += '.png';
    }

    weatherImg.src = newSrc;
    console.log('new: ' + newSrc);
    Database.store('S', { fontType: style.fontType, themeType: style.themeType });
    loadStyle();
  });
}
