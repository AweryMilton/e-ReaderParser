const { appendToFile,processBooks } = require("./starterHelpers");
const { clickAndReload } = require("./clickAndReloadHelpers");
const { handlePopup } = require("./popupHelpers");
const selectors = require('../selectors');
async function runBookInfoTest(page, level, outputFileName) {
    await handlePopup(page);
    await clickAndReload(page, level);

    const booksSelector = selectors.books;
    const books = await page.$$(booksSelector);

    const collectedData = await processBooks(books, page, outputFileName);


    for (const bookInfo of collectedData) {
        await appendToFile(bookInfo, outputFileName);
    }
}

module.exports = { runBookInfoTest };