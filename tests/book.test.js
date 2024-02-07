const {test} = require('@playwright/test');
const helpers = require('./bookHelpers/index');


test.beforeEach(async ({page}) => {
    test.setTimeout(5000000);
    await page.goto('https://english-e-reader.net/');
});


test('Book info A1', async ({page}) => {
    await helpers.runBookInfoTest(page, 'A1 starter', 'starterOutput.json');
});

test('Book info A2', async ({page}) => {
    await helpers.runBookInfoTest(page, 'A2 elementary', 'elementaryOutput.json');
});

test('Book info B1', async ({page}) => {
    await helpers.runBookInfoTest(page, 'B1 pre-intermediate', 'preIntermediateOutput.json');
});

test('Book info B1+', async ({page}) => {
    await helpers.runBookInfoTest(page, 'B1+ intermediate', 'intermediateOutput.json');
});

test('Book info B2', async ({page}) => {
    await helpers.runBookInfoTest(page, 'B2 intermediate-plus', 'intermediatePlusOutput.json');
});

test('Book info B2+', async ({page}) => {
    await helpers.runBookInfoTest(page, 'B2+ upper-intermediate', 'upperIntermediateOutput.json');
});

test('Book info C1', async ({page}) => {
    await helpers.runBookInfoTest(page, 'C1 advanced', 'advancedOutput.json');
});

test('Book info C2', async ({page}) => {
    await helpers.runBookInfoTest(page, 'C2 unabridged', 'unabridgedOutput.json');
});
