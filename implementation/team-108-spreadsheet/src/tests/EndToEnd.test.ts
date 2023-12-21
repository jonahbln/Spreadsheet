
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

// testing puppeteer itself
describe('Google', () => {

  let browser: Browser;
  let page: Page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });
  
    it('should be titled "Google"', async () => {
        await page.goto("https://www.google.com");
        const title = await page.title();
        expect(title).toBe("Google");
    });
});

describe('Spreadsheet App End To End', () => {

  let browser: Browser;
  let page: Page;

  beforeAll(async() => {
    browser = await puppeteer.launch({
      headless: false,
      // pipe: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        // '--single-process',
        '--disable-features=site-per-process'
      ],
      slowMo: 5
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });

  afterEach(async () => {
    await page.close();
    page = null as any;
  });

  afterAll(async () => {
    await browser.close();
    browser = null as any;
  });

  it('should have the title "React Spreadsheet"', async () => {

    console.log(page.title());

    await expect(page.title()).resolves.toEqual("React Spreadsheet");

  });

  it ('should start with a formula value of "".', async () => {

    const displayValue: string = await (await (await page.$('.formulaEntry') as ElementHandle<Element>).getProperty('textContent')).jsonValue() as string;

    expect(displayValue).toEqual('');
  });

  it ('After entering a formula value, the value should update.', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('1');
    await page.keyboard.press("Enter");

    const displayValue: string = await (await (await page.$("input[type=text]") as ElementHandle<Element>).getProperty('textContent')).jsonValue() as string;

    // expect(displayValue).toEqual('1');

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual("1");

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("1");
  });

  it ('After entering a longer formula value, the value should update.', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('12*4');
    await page.keyboard.press("Enter");


    const displayValue: string = await (await (await page.$("input[type=text]") as ElementHandle<Element>).getProperty('textContent')).jsonValue() as string;

    // expect(displayValue).toEqual('1');

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual("12*4");

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("12*4");
  });

  it ('Entering formula values should also work for string literals.', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('moose');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual("moose");

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("moose");
  });






  // Evaluating Formulas
  it ('After entering a longer formula value, the value should update.', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('=12*4');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual("=12*4");

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("48");
  });

  it ('After entering a more complex formula value, the value should update.', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('=2*4+6');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual("=2*4+6");

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("14");
  });

  it ('Cell Reference should render properly', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('=REF(A2)+1');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual("=REF(A2)+1");

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("1");
  });

  it ('After entering a string formula, the value should update.', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('="dog"+"cat"');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual('="dog"+"cat"');

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("dogcat");
  });






  // Basic errors:
  it ('Should display nothing after a circular reference', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('=REF(A1)');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual("=REF(A1)");

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("");
  });

  it ('Should display nothing after trying a numerical operation on a string', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('="dog"-1');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual('="dog"-1');

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("!EXP");
  });

  it ('Should display nothing after trying a numerical operation on a string', async () => {
    // select cell first
    await page.click("#cell1");

    await page.focus('input[type=text]');
    await page.keyboard.type('="dog"-1');
    await page.keyboard.press("Enter");

    const formulaEntryResult = await page.$eval("input[type=text]", (input) => {
        return input.getAttribute("value")
    });

    expect(formulaEntryResult).toEqual('="dog"-1');

    // get cell value
    let firstCellClass = await page.$eval("#cell1", element=> element.getAttribute("class"));

    let firstCellValue = await page.$eval("#cell1", element=> element.getAttribute("value"));

    expect(firstCellClass).toEqual("highlighted-formulaButton");

    expect(firstCellValue).toEqual("!EXP");
  });
});