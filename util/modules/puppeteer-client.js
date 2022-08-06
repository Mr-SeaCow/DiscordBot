const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin());

function fetchPageInfo(url, callback) {
    puppeteer.launch({ headless: true }).then(async browser => {
    const page = await browser.newPage()

    await page.goto(url)
    const extractedText = await page.$eval('*', (el) => el.innerText);
    await browser.close()
    callback(extractedText);
    })
}

module.exports = {fetchPageInfo}