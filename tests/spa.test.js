import { IDConverter } from '../source/classes/IDConverter.js'

// gets the current date and deconstructs it
let currDate = new Date();
let day = currDate.getDate();;
let year = currDate.getFullYear();

let currDay = IDConverter.getDayFromDate(currDate);
let currMonth = IDConverter.getMonthFromDate(currDate);
let currSuffix = IDConverter.getSuffixOfDate(currDate);

describe('Basic user flow for SPA ', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp21-group10.github.io/cse110-sp21-group10/source/HTML/log.html#day');
    await page.waitForTimeout(500);
  });

  it('Test 1: The daily page header should read May 31, 2021', async () => {
    const header = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe(currDay + ", " + currMonth + " " + day + currSuffix);
  });
  
  it('Test 2: Clicking zoom out button should change page url to /#month', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id == 'zoom-out-button') {
          buttons[i].click();
        }        
      }
    });
    expect(page.url().includes('#month')).toBe(true);
  });

  it('Test 3: Clicking zoom out button should change page header to May 2021', async () => {
    const header = await page.$eval('monthly-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe(currMonth + " " + year);
  });
  
  it('Test 4: Clicking zoom out button should change page url to /#year', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id == 'zoom-out-button') {
          buttons[i].click();
        }        
      }
    });
    expect(page.url().includes('#year')).toBe(true);
  });

  it('Test 5: Clicking zoom out button should change page header to 2021', async () => {
    const header = await page.$eval('yearly-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe("" + year);
  });

  it('Test 6: Clicking the back buttons should change page url to /#month', async () => {
    await page.goBack();
    expect(page.url().includes('#month')).toBe(true);
  });

  it('Test 7: Clicking the back buttons should change page url to /#daily', async () => {
    await page.goBack();
    expect(page.url().includes('#day')).toBe(true);
  });

  it('Test 8: Clicking the add entry button should add a new bullet-entry element', async () => {
    const bulletListLength = await page.$eval('daily-log', (elem) => {
      elem.shadowRoot.querySelector('.new-bullet').click();
      return elem.shadowRoot.querySelectorAll('bullet-entry').length;
    });
    expect(bulletListLength).toBe(1);
  });
});