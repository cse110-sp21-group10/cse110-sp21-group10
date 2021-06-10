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
    await page.$$eval('button', (dailyButtons) => {
      for (let i = 0; i < dailyButtons.length; i++) {
        if (dailyButtons[i].id === 'zoom-out-button') {
          dailyButtons[i].click();
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
    await page.$$eval('button', (monthlyButtons) => {
      for (let i = 0; i < monthlyButtons.length; i++) {
        if (monthlyButtons[i].id === 'zoom-out-button') {
          monthlyButtons[i].click();
        }
      }
    });
    expect(page.url().includes('#year')).toBe(true);
  });
  it('Test 5: Clicking zoom out button should change page header to 2021', async () => {
    const header = await page.$eval('yearly-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe('' + year);
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
    const lastEntryForwardHeader = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(lastEntryForwardHeader).toBe(currDay + ', ' + currMonth + ' ' + day + currSuffix);
  });
  it('Test 14: Clicking the next-day button should put us on the next day', async () => {
    await page.$$eval('button', (buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'next-day') {
          buttons[i].click();
        }
      }
    });
    const nextDayHeader = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    const nextDate = new Date();
    nextDate.setDate(currDate.getDate() + 1);
    const nextDay = nextDate.getDate();
    const nextDayOfWeek = IDConverter.getDayFromDate(nextDate);
    const nextMonth = IDConverter.getMonthFromDate(nextDate);
    const nextSuffix = IDConverter.getSuffixOfDate(nextDate);
    expect(nextDayHeader).toBe(nextDayOfWeek + ', ' + nextMonth + ' ' + nextDay + nextSuffix);
  });
  it('Test 15: Clicking the last-entry-back button should put us on the current day', async () => {
    await page.$$eval('button', (buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'last-entry-back') {
          buttons[i].click();
        }
      }
    });
    const lastEntryBackHeader = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(lastEntryBackHeader).toBe(currDay + ', ' + currMonth + ' ' + day + currSuffix);
  });
  it('Test 16: Clicking the prev-day button should put us on the prev day', async () => {
    await page.$$eval('button', (buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'prev-day') {
          buttons[i].click();
        }
      }
    });
    const prevDayHeader = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    const prevDate = new Date();
    prevDate.setDate(currDate.getDate() - 1);
    const prevDay = prevDate.getDate();
    const prevDayOfWeek = IDConverter.getDayFromDate(prevDate);
    const prevMonth = IDConverter.getMonthFromDate(prevDate);
    const prevSuffix = IDConverter.getSuffixOfDate(prevDate);
    expect(prevDayHeader).toBe(prevDayOfWeek + ', ' + prevMonth + ' ' + prevDay + prevSuffix);
  });
  it('Test 17: First get back to current day. Clicking the menu button should open the menu', async () => {
    await page.$eval('#next-day', (b1) => {
      b1.click();
    });
    await page.$eval('#menu-button', (b2) => {
      b2.click();
    });
    const indexClass = await page.$eval('main', (elem) => {
      return elem.querySelector('#index').className;
    });
    expect(indexClass.includes('active')).toBe(true);
  });
  it('Test 18: Clicking a font should change the font on the page', async () => {
    await page.$$eval('button', (buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'verdana') {
          buttons[i].click();
        }
      }
    });
    const bodyFontFamily = await page.$eval('body', (elem) => {
      return elem.style.fontFamily;
    });
    expect(bodyFontFamily.includes('Verdana, sans-serif')).toBe(true);
  });
  it('Test 19: Clicking the close menu button should close the menu', async () => {
    await page.$$eval('button', (buttons) => {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === 'close-index') {
          buttons[i].click();
        }
      }
    });
    const indexClass = await page.$eval('main', (elem) => {
      return elem.querySelector('#index').className;
    });
    expect(indexClass.includes('active')).toBe(false);
  });
  it('Test 20: Clicking the return button on a bullet enrty creates a new nested journal entry', async () => {
    const bulletListLength = await page.$eval('daily-log', (elem) => {
      const nestedShadowRoot = elem.shadowRoot.querySelector('bullet-entry').shadowRoot;
      nestedShadowRoot.querySelectorAll('button')[0].click();
      return nestedShadowRoot.querySelectorAll('bullet-entry').length;
    });
    expect(bulletListLength).toBe(1);
  });
  it('Test 21: Clicking the delete button on a bullet enrty deletes the journal entry', async () => {
    const isEmpty = await page.$eval('daily-log', (elem) => {
      const entry = elem.shadowRoot.querySelector('bullet-entry');
      entry.shadowRoot.querySelectorAll('button')[2].click();
      return entry.length === undefined;
    });
    expect(isEmpty).toBe(true);
  });
  it('Test 22: Clicking the related-sections-button button should add another section to the page', async () => {
    const sectionID = await page.$eval('daily-log', (elem) => {
      elem.shadowRoot.querySelector('#related-sections-button').click();
      return elem.shadowRoot.querySelectorAll('.log')[2].id;
    });
    expect(sectionID).toBe('02');
  });
});
