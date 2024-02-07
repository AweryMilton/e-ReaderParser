const { test } = require('@playwright/test');
const fs = require('fs/promises');
const { searchAndFilterBooks } = require('./gutenbergHelpers/searchHelper');

const testFiles = [
    'starterOutput.json',
    'elementaryOutput.json',
    'preIntermediateOutput.json',
    'intermediateOutput.json',
    'intermediatePlusOutput.json',
    'upperIntermediateOutput.json',
    'advancedOutput.json',
    'unabridgedOutput.json',
];


testFiles.forEach((file) => {
    test(`Expect books for ${file}`, async ({ page }) => {
        test.setTimeout(5000000);
        await page.goto('https://www.gutenberg.org/');

        const outputFilePath = `outputFiles/${file}`;
        const jsonData = await fs.readFile(outputFilePath, 'utf-8');
        const booksData = JSON.parse(jsonData);

        await searchAndFilterBooks(page, outputFilePath, booksData);
    });
});
