require('../../navbar.js');
require('../../auth.js');

import { sendGoogleAnalyticsPageView,
         sendGoogleAnalyticsEvent } from '../../googleAnalytics.js';

$('#myPlaylistsDropdown a').on('click', function () {
  var selectedVal = $(this).html();

  $('#playlist-list-my-playlists').hide();
  $('#playlist-list-recommended-for-me').hide();
  $('#playlist-list-recommended-by-me').hide();

  if (selectedVal === 'My Playlists') {
    $('#playlist-list-my-playlists').show();
    sendGoogleAnalyticsEvent('Playlists', 'show My Playlists');
  } else if (selectedVal === 'Recommended for Me') {
    $('#playlist-list-recommended-for-me').show();
    sendGoogleAnalyticsEvent('Playlists', 'show Recommended for Me');
  } else if (selectedVal === 'Recommended by Me') {
    $('#playlist-list-recommended-by-me').show();
    sendGoogleAnalyticsEvent('Playlists', 'show Recommended by Me');
  }

  $('#myPlaylistsDropdown button').html(selectedVal);

  $('.playlist-list-item-title').truncate({ lines: 1 });
  $('.playlist-list-item-subtitle').truncate({ lines: 1 });
});

// TODO: this isn't being used properly here. Nothing is truncated on page load.
$('#hide-until-truncation-finishes').hide();

sendGoogleAnalyticsPageView();
