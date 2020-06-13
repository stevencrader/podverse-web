const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/podcasts`)
  },
  'Podcasts Tests': function (browser) {
    browser
      .waitForElementWithText('h3', 'Podcasts')
      .testSharedMetaTags()
      .testPageMetaTags(
          `Podcasts`,
          `Find and subscribe to podcasts.`
      )

      .scrollToSelector(`.pv-pagination`)
      .clickByXpath(`//button[@class="page-link"][contains (text(), "3")]`)
      .waitForXpathPresent('//div[@class="media-list-item-b__title"][contains(text(), "Making Sense with Sam Harris")]')
      .refresh()

  },
  after: function (browser) {
    browser.end()
  }
}
