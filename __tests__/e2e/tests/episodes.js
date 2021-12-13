const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Episodes': function (browser) {
    browser
      .click('div a[href="/episodes"]')
      .waitForElementWithText('.page-header h1', 'Episodes') // Page Header
      .waitForElementWithText('.episode-list-item:nth-child(1)', '#1428 - Brian Greene') // Episode List Item Title Header




  },
  after: function (browser) {
    browser.end()
  }
}
