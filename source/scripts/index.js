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
      headerType = fontType = 'Verdana, sans-serif';
    }

    if (idName === 'default-font') {
      fontType = 'Times New Roman, serif';
      headerType = 'Kaushan Script, cursive';
    }

    if (idName === 'garamond') {
      headerType = fontType = 'Garamond, serif';
    }

    if (idName === 'courier-new') {
      headerType = fontType = 'Courier New, serif';
    }

    if (idName === 'helvetica') {
      headerType = fontType = 'Helvetica, sans-serif';
    }
    
    // necessary html header elements for changing the font
    const dailyHeader = document.querySelector('daily-log').shadowRoot.querySelector('#daily-header > h1');
    const monthlyHeader = document.querySelector('monthly-log').shadowRoot.querySelector('#monthly-header > h1');
    const yearlyHeader = document.querySelector('yearly-log').shadowRoot.querySelector('#yearly-header > h1');
    // console.log("first: " + document.body.style.fontFamily);
    // document.body.style.fontFamily = '';
    document.body.style.fontFamily = fontType;
    // console.log(fontType);
    // console.log("after: " + document.body.style.fontFamily);
    dailyHeader.style.fontFamily = headerType;
    monthlyHeader.style.fontFamily = headerType;
    yearlyHeader.style.fontFamily = headerType;
  });
}

/** Changing the display to be in dark mode
  * TODO: Figure out why the header color will change, but not the contents of bullets
  * TODO: Only change the necessary icons:
  *       might need to add another class to the icons that will change
  */
const darkModeBtn = document.getElementById('dark-mode');
darkModeBtn.addEventListener('click', () => {
  document.getElementsByTagName( 'html' )[0].className = 'dark-mode-theme';
// document.getElementById('index').className = 'dark-mode-theme';

});

const defaultThemeBtn = document.getElementById('default-theme');
defaultThemeBtn.addEventListener('click', () => {
  document.getElementsByTagName( 'html' )[0].className = '';
});
