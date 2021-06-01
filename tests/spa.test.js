describe('Basic user flow for SPA ', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/source/HTML/log.html');
    await page.waitForTimeout(500);
  });

  it('Test 1: The daily page header should read May 31, 2021', async () => {
    const header = await page.$eval('daily-log', (elem) => {
      return elem.shadowRoot.querySelector('h1').textContent;
    });
    expect(header).toBe('Monday, May 31st');
  });

  it('Test 2: Clicking zoom out button should change page url to /#month', async () => {
    await page.$$eval('button', (buttons) => { buttons[1].click(); });
    expect(page.url().includes('#month')).toBe(true);
  });

  it('Test 3: Clicking zoom out button should change page header to May 2021', async () => {
    const header = await page.$$eval('h1', (headers) => {
      return headers[0].textContent;
    });
    expect(header).toBe('May 2021');
  });

  it('Test 4: Clicking zoom out button should change page url to /#year', async () => {
    await page.$$eval('button', (buttons) => {
      buttons[1].click();
    });
    expect(page.url().includes('#year')).toBe(true);
  });

  it('Test 5: Clicking zoom out button should change page header to 2021', async () => {
    const header = await page.$$eval('h1', (headers) => {
      return headers[1].textContent;
    });
    expect(header).toBe('2021');
  });

  it('Test 6: Clicking the back buttons should change page url to /#month', async () => {
    await page.goBack();
    expect(page.url().includes('#month')).toBe(true);
  });

  it('Test 7: Clicking the back buttons should change page url to /#daily', async () => {
    await page.goBack();
    expect(page.url().includes('#daily')).toBe(true);
  });

  it('Test 8: Clicking the add entry button should add a new bullet-entry element', async () => {
    const bulletListLength = await page.$eval('daily-log', (elem) => {
      elem.shadowRoot.querySelector('.new-bullet').click();
      return elem.shadowRoot.querySelectorAll('bullet-entry').length;
    });
    expect(bulletListLength).toBe(1);
  });
});
