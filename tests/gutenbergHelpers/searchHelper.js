const fs = require('fs/promises');
const { BookStatus } = require('./enum');
const selectors = require('../selectors');

async function enterSearchQuery(page, query) {
    await page.fill(selectors.searchInput, query);
}

async function clickSearchButton(page) {
    await page.click(selectors.submitButton);
    await page.waitForTimeout(2000);
}

async function isBookVisible(page, title) {
    return await page.isVisible(`text="${title}"`);
}

async function addOrUpdateBookInfo(filePath, bookData, status) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const existingData = JSON.parse(data);

        const bookIndex = existingData.findIndex(b => b.title === bookData.title && b.author === bookData.author);

        if (bookIndex !== -1) {
            existingData[bookIndex].status = status;
        } else {
            existingData.push({ ...bookData, status });
        }

        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
        console.log('Book info added or updated successfully.');
    } catch (error) {
        console.error('Error adding or updating book info:', error);
    }
}

async function clearSearchInput(page) {
    await page.fill('#menu-book-search', '');
}

async function searchAndFilterBooks(page, filePath, booksData) {
    try {
        for (const bookData of booksData) {
            const { title, author } = bookData;
            const searchQuery = `${title} ${author}`;

            await enterSearchQuery(page, searchQuery);
            await clickSearchButton(page);
            await page.waitForTimeout(2000);

            const bookVisible = await isBookVisible(page, title);

            const bookStatus = bookVisible ? BookStatus.WITHOUT_COPYRIGHT : BookStatus.WITH_COPYRIGHT;
            await addOrUpdateBookInfo(filePath, bookData, bookStatus);

            if (!bookVisible) {
                console.log(`Book not found: ${title} by ${author}`);
            }

            await clearSearchInput(page);
        }

        console.log('Search and filter complete!');
    } catch (error) {
        console.error('Error during search and filter:', error);
    }
}

module.exports = { searchAndFilterBooks };
