const selectors = {
    books: 'div.col-md-2.col-sm-4.col-xs-6 div.book-container',
    title: 'div.col-md-9 h1',
    author: 'div.col-md-10 h4',
    description: 'div.col-sm-12 p',
    uniqueWords: 'div#hard-words h3.panel-title',
    hardWords: 'div#hard-words p',
    selectFile: '//*[@class="btn btn-success dropdown-toggle"]',
    selectFileTxt: '(//*[@class="dropdown-item"])[5]',
    downloadFileTxt: '//*[@id="download"]',
    searchInput: '#menu-book-search',
    submitButton: 'input[type="submit"][name="submit_search"]',
};

module.exports = selectors;