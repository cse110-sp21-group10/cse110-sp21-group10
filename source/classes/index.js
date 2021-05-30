/* Getter for the Hamburger menu button */
let indexBtn = document.getElementById('menu-button');

/* Getter for the Index div */
let indexEl = document.getElementById('index');

/* Getter for the 'Font' div */
let fontBtn = document.getElementById('font-setting');

/* Getter for the 'Theme' div */
let themeBtn = document.getElementById('theme-setting');

/* Getter for the 'X' button */
let indexCloseBtn = document.getElementById('close-index');

// TODO: Figure out how to change header font
//       Customize font sizes

/* Adds functionality to the hamburger menu icon to open the index */
indexBtn.addEventListener('click', (event) => {
    indexEl.classList.toggle('active');
});

/* Adds functionality to the 'X' icon to close the index */
indexCloseBtn.addEventListener('click', (event) => {
    indexEl.classList.toggle('active');
});


// This is what creates the collapsible menus for Font and Themes
let coll = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

/** Changing the text of the body element
  * TODO: Figure out why the header isn't changing as well
  */
let verdanaBtn = document.getElementById('verdana');
verdanaBtn.addEventListener('click', (event) => {
    console.log("font changing?");
    document.body.style.fontFamily = "verdana, sans-serif";
    document.getElementsByTagName('h1').style.fontFamily = "verdana, sans-serif";
})

/** Changing the display to be in dark mode
  * TODO: Figure out why the header color will change, but not the contents of bullets
  * TODO: Only change the necessary icons:
  *       might need to add another class to the icons that will change
  */
let darkModeBtn = document.getElementById('dark-mode');
darkModeBtn.addEventListener('click', (event) => {
    console.log("theme changing? - isn't done yet");
    document.body.style.color = "white";
    document.body.style.backgroundColor = "black";

    let icons = document.querySelectorAll('button');
    for (let i = 0; i < icons.length; i++) {
        icons[i].style.color = "white";
    }
})