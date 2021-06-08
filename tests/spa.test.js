import { IDConverter } from '../source/classes/IDConverter.js';

// gets the current date and deconstructs it
const currDate = new Date();
const day = currDate.getDate();
const year = currDate.getFullYear();

const currDay = IDConverter.getDayFromDate(currDate);
const currMonth = IDConverter.getMonthFromDate(currDate);
const currSuffix = IDConverter.getSuffixOfDate(currDate);

describe('Basic user flow for SPA ', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp21-group10.github.io/cse110-sp21-group10/source/HTML/log.html');
    await page.waitForTimeout(500);
  });
  it('Test 1: The daily page header should read the current date', async () => {
    const header = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe(currDay + ', ' + currMonth + ' ' + day + currSuffix);
  });
  it('Test 2: Clicking zoom out button should change page url to /#month', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'zoom-out-button') {
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
    expect(header).toBe(currMonth + ' ' + year);
  });
  it('Test 4: Clicking zoom out button should change page url to /#year', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'zoom-out-button') {
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
  it('Test 9: Clicking the foward buttons should change page url to /#month', async () => {
    await page.goForward();
    expect(page.url().includes('#month')).toBe(true);
  });
  it('Test 10: Clicking the foward buttons should change page url to /#year', async () => {
    await page.goForward();
    expect(page.url().includes('#year')).toBe(true);
  });
  it('Test 11: Clicking the January button should change page url to /#month', async () => {
    await page.$eval('yearly-log', (elem) => {
      elem.shadowRoot.querySelectorAll('button')[0].click();
    });
    expect(page.url().includes('#month')).toBe(true);
  });
  it('Test 12: Clicking the 1 button should change page url to /#day', async () => {
    await page.$eval('monthly-log', (elem) => {
      elem.shadowRoot.querySelectorAll('button')[0].click();
    });
    expect(page.url().includes('#day')).toBe(true);
  });
  it('Test 13: Clicking the last-entry-forward button should put us on the current day', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'last-entry-forward') {
          buttons[i].click();
        }        
      }
    });
    const header = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe(currDay + ', ' + currMonth + ' ' + day + currSuffix);
  });
  it('Test 14: Clicking the next-day button should put us on the next day', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'next-day') {
          buttons[i].click();
        }        
      }
    });
    const header = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    const nextDate = new Date();
    nextDate.setDate(currDate.getDate() + 1);
    
    const nextDay = nextDate.getDate();

    const nextDayOfWeek = IDConverter.getDayFromDate(nextDate);
    const nextMonth = IDConverter.getMonthFromDate(nextDate);
    const nextSuffix = IDConverter.getSuffixOfDate(nextDate);
    
    expect(header).toBe(nextDayOfWeek + ', ' + nextMonth + ' ' + nextDay + nextSuffix);
  });
  it('Test 15: Clicking the last-entry-back button should put us on the current day', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'last-entry-back') {
          buttons[i].click();
        }        
      }
    });
    const header = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe(currDay + ', ' + currMonth + ' ' + day + currSuffix);
  });
  it('Test 16: Clicking the prev-day button should put us on the prev day', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'prev-day') {
          buttons[i].click();
        }        
      }
    });
    const header = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    const prevDate = new Date();
    prevDate.setDate(currDate.getDate() - 1);
    
    const prevDay = prevDate.getDate();

    const prevDayOfWeek = IDConverter.getDayFromDate(prevDate);
    const prevMonth = IDConverter.getMonthFromDate(prevDate);
    const prevSuffix = IDConverter.getSuffixOfDate(prevDate);
    
    expect(header).toBe(prevDayOfWeek + ', '  + prevMonth + ' ' + prevDay + prevSuffix);
  });

  /*
  it('Test 17: First get back to current day. Then clicking on the weather icon should change the temperature type', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'next-day') {
          buttons[i].click();
        }        
      }
    });
    const weather = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelectorAll[4].querySelector('p');
    });
    weather.click();
    expect(weather.querySelector('span').textContent).toBe('C');
  });
  it('Test 18: Clicking the menu button should open the menu', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'menu-button') {
          buttons[i].click();
        }        
      }
    });
    const index = await page.$$eval('div', (divs) => { 
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'index') {
          return divs[i];
        }        
      }
    });
    expect(index.className.includes('active')).toBe(true);
  });
  it('Test 19: Clicking a font should change the font on the page', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'verdana') {
          buttons[i].click();
        }        
      }
    });
    const body = await page.$eval('body', (elem) => { 
      return elem;
    });
    expect(body.style.fontFamily.includes('Verdana, sans-serif')).toBe(true);
  });
  it('Test 20: Clicking the close menu button should close the menu', async () => {
    await page.$$eval('button', (buttons) => { 
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'close-index') {
          buttons[i].click();
        }        
      }
    });
    const index = await page.$$eval('div', (divs) => { 
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === 'index') {
          return divs[i];
        }        
      }
    });
    expect(index.className.includes('active')).toBe(false);
  });

  /**
   * To test:
   *    Clicking on the weather icon changes the temperature value
   *    Clicking on menu icon sets the right class for the 'index' div
   *    Changing the font sets the style of the body to the right font
   *    Clicking the close menu buttons should remove the right class from the 'index' div
   *    Clicking the return button creates a new journal entry
   *    Clcking the delete button deletes a journal entry
   *    Clicking the add section buttons adds a new section with id '02'
   *    Clicking the new bullet button in the new section adds a new bullet to the section
   *    Clicking the delete section button deletes the section with id '02'
   */
});
