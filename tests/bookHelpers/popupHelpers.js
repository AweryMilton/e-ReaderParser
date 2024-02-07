

async function handlePopup(page) {
    const popupSelector = '//*[@id="onesignal-slidedown-dialog"]';
    const isPopupVisible = await page.isVisible(popupSelector);

    if (isPopupVisible) {
        const buttonSelector = '//*[@id="onesignal-slidedown-cancel-button"]';
        await page.click(buttonSelector);
    } else {
        console.log('Error!');
    }
}

module.exports = {handlePopup};