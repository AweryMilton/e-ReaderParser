const helpers = require('./index');


async function clickElementByText(page, text) {
    await page.click(`text=${text}`);
}
async function clickAndReload(page, level) {
    await clickElementByText(page, 'LIBRARY');
    await page.waitForTimeout(2000);
    await clickElementByText(page, level);

    await page.reload();

    await clickElementByText(page, 'LIBRARY');
    await page.waitForTimeout(2000);
    await clickElementByText(page, level);
}

module.exports = { clickAndReload };
