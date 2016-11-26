/* KEY: dimension1: podcast title
        dimension2: episode title
        dimension3: clip title */

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','http://www.google-analytics.com/analytics.js','ga');

ga('create', __GOOGLE_ANALYTICS_UA__, 'auto');

export function sendGoogleAnalyticsPageView() {
  ga('send', 'pageview');
}

export function sendGoogleAnalyticsPlayerPageView() {
  if (isEpisode) {
    ga('send', 'pageview', {
      'dimension1': podcastTitle,
      'dimension2': episodeTitle
    });
  } else { // it's a clip
    ga('send', 'pageview', {
      'dimension1': podcastTitle,
      'dimension2': episodeTitle,
      'dimension3': description
    });
  }
}

export function sendGoogleAnalyticsPodcastPageView() {
  ga('send', 'pageview', {
    'dimension1': podcastTitle
  });
}

export function sendGoogleAnalyticsEvent(category, action) {
  ga('send', {
    hitType: 'event',
    eventCategory: category,
    eventAction: action
    // eventLabel: 'Campaign Name'
  });
}
