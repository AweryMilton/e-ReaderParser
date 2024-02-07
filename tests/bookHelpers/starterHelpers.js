const fs = require('fs/promises');
const selectors = require('../selectors');
const baseDownloadUrl = 'https://english-e-reader.net/download';


async function collectBookInformation(page, outputFileName) {
    const titleSelector = selectors.title;
    const authorSelector = selectors.author;
    const descriptionSelector = selectors.description;
    const uniqueWordsSelector = selectors.uniqueWords;
    const hardWordsSelector = selectors.hardWords;
    const selectFileSelector = selectors.selectFile;
    const selectFileTxtSelector = selectors.selectFileTxt;
    const downloadFileTxtSelector = selectors.downloadFileTxt;

    const title = await page.$eval(titleSelector, el => el ? el.textContent.trim() : '');
    const author = await page.$eval(authorSelector, el => el ? el.textContent.trim() : '');
    const description = await page.$eval(descriptionSelector, el => el ? el.textContent.trim() : '');

    const uniqueWordsElement = await page.waitForSelector(uniqueWordsSelector, {visible: true, state: 'attached'});
    const uniqueWordsRaw = await page.evaluate(el => el ? el.textContent : '', uniqueWordsElement);
    const matchUniqueWords = uniqueWordsRaw.match(/Unique words: (\d+) Total\s*words: (\d+)/);
    const uniqueWordsCount = matchUniqueWords ? matchUniqueWords[1] : '';
    const totalWordsCount = matchUniqueWords ? matchUniqueWords[2] : '';
    const uniqueWords = {
        uniqueCount: uniqueWordsCount,
        totalCount: totalWordsCount
    };

    const hardWordsElement = await page.waitForSelector(hardWordsSelector, {visible: true, state: 'attached'});
    const hardWordsRaw = await page.evaluate(el => el ? el.textContent.replace('Hard words:', '').trim() : '', hardWordsElement);
    const hardWordsList = hardWordsRaw.split(', ').map(word => word.trim());

    const selectFileElement = await page.waitForSelector(selectFileSelector, {visible: true, state: 'attached'});
    await selectFileElement.click();

    const selectFileTxtElement = await page.waitForSelector(selectFileTxtSelector, {visible: true, state: 'attached'});
    await selectFileTxtElement.click();

    const downloadFileTxtElement = await page.waitForSelector(downloadFileTxtSelector, {
        visible: true,
        state: 'attached'
    });
    await downloadFileTxtElement.click();

    await page.waitForTimeout(2000);

    await page.waitForSelector(downloadFileTxtSelector, {visible: true, state: 'attached'});
    const downloadLink = await generateDownloadLink(title, author);

    const bookInfo = {
        title,
        author,
        description,
        uniqueWords,
        hardWords: hardWordsList,
        downloadLink,
        status: 'UNDEFINED'
    };

    const outputFilePath = `outputFiles/${outputFileName}`;
    await appendToFile(bookInfo, outputFilePath);

    return bookInfo;
}

async function generateDownloadLink(title, author) {
    const uniquePart = `${title}-${author}`.replace(/\s+/g, '-');
    return `${baseDownloadUrl}?link=${uniquePart}&format=txt`;
}

async function appendToFile(newBookData, filePath) {
    try {
        const existingData = JSON.parse(await fs.readFile(filePath, 'utf-8') || '[]');
        existingData.push(newBookData);
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
        console.log(`Complete! ${filePath}`);
    } catch (error) {
        console.error('Error!', error);
    }
}

async function processBooks(books, page, outputFileName) {
    const collectedData = new Map();
    for (const book of books) {
        const bookLink = await book.$('a');
        if (bookLink) {
            const href = await bookLink.getAttribute('href');
            const bookPage = await page.context().newPage();

            try {
                await bookPage.goto(`https://english-e-reader.net${href}`);
                await bookPage.waitForTimeout(2000);

                const bookInfo = await collectBookInformation(bookPage, outputFileName);

                const identifier = `${bookInfo.title}-${bookInfo.author}`;
                if (!collectedData.has(identifier)) {
                    collectedData.set(identifier, bookInfo);
                } else {
                    console.log(`Duplicate book: ${identifier}`);
                }
            } catch (error) {
                console.error('Error processing book:', error);
            } finally {
                await bookPage.close();
            }
        } else {
            console.log('Book link is not visible');
        }
    }

    return [...collectedData.values()];
}

module.exports = {processBooks, appendToFile};
