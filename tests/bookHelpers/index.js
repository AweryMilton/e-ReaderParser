const starterHelpers = require('../bookHelpers/starterHelpers');
const popupHelpers = require('../bookHelpers/popupHelpers');
const clickAndReloadHelpers = require('../bookHelpers/clickAndReloadHelpers');
const bookInfoHelpers = require('../bookHelpers/bookInfoHelpers');

module.exports = {
    ...starterHelpers,
    ...popupHelpers,
    ...clickAndReloadHelpers,
    ...bookInfoHelpers,
};