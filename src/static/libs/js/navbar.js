import { addPodcastModalSave } from './addPodcastModal.js';
import { logoutUser } from './auth.js';
import { loadPodcastSearchTypeahead } from './podcastHelper.js';

// If an access_token is provided in the URL, then append nav buttons in the on
// authenticated event instead of on page load.
if (location.href.indexOf('#access_token') === -1) {
  // If user is a logged-in user, display different navbar buttons
  if (localStorage.getItem('nickname')) {
    appendLoggedInUserNavButtons();
  } else {
    appendNonLoggedInUserNavButtons();
  }
}

$('#navbarSearchModal').on('shown.bs.modal', function () {
  $('#navbarSearchModalInput').focus()
});
loadPodcastSearchTypeahead();

$('#addPodcastModalAddButton').on('click', function () {
  addPodcastModalSave();
});

$('#navbarSearchModalInput').bind('keypress', function (event) {
  if (event.keyCode == 13) {
    event.preventDefault(event);
  }
})

function appendLoggedInUserNavButtons () {

  if (location.href.indexOf('/login-redirect') > -1) {
    return
  }

  $('#navbar-btn').addClass('btn-group');

  var navDropdownButtonString =   '<a class="dropdown-toggle nav-link hidden-xs-down" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +  localStorage.getItem('nickname') +'</a>';
      navDropdownButtonString +=  '<div class="dropdown-menu hidden-xs-down" aria-labelledby="dropdownMenu1">';
      navDropdownButtonString +=    '<a class="dropdown-item" href="/settings">Settings</a>';
      navDropdownButtonString +=    '<a class="dropdown-item" id="logout-user-dropdown-item">Logout</a>';
      navDropdownButtonString +=  '</div>';

  $('#navbar-btn').html(navDropdownButtonString);

  var navButtonString =   '<li class="nav-item">';
      navButtonString +=    '<a id="navbar-search-icon" class="nav-link hidden-xs-down" data-toggle="modal" data-target="#navbarSearchModal"><i class="fa fa-search"></i></a>';
      navButtonString +=  '</li>';
      navButtonString +=   '<li class="nav-item">';
      navButtonString +=    '<a class="nav-link hidden-xs-down" href="/my-podcasts">Podcasts</a>';
      navButtonString +=  '</li>';
      navButtonString +=  '<li class="nav-item">';
      navButtonString +=    '<a class="nav-link hidden-xs-down" href="/my-playlists">Playlists</a>';
      navButtonString +=  '</li>';

  $(navButtonString).insertAfter('#navbar-btn');

  var navMobileMenuString = '<a class="nav-link hidden-sm-up" href="/my-podcasts">Podcasts</a>';
      navMobileMenuString += '<a class="nav-link hidden-sm-up" href="/my-playlists">Playlists</a>';
      navMobileMenuString += '<a class="nav-link hidden-sm-up" href="/settings">Settings</a>';
      navMobileMenuString += '<hr class="hidden-sm-up">';
      navMobileMenuString += '<a class="nav-link hidden-sm-up" id="logout-user-nav-link">Logout</a>';

  $(navMobileMenuString).insertAfter('#navbar-btn');

  $('#logout-user-dropdown-item, #logout-user-nav-link').on('click', function () {
    logoutUser();
  });
}

function appendNonLoggedInUserNavButtons () {
  var searchButtonString =   '<li class="nav-item">';
      searchButtonString +=    '<a id="navbar-search-icon" class="nav-link hidden-xs-down" data-toggle="modal" data-target="#navbarSearchModal"><i class="fa fa-search"></i></a>';
      searchButtonString +=  '</li>';
  $(searchButtonString).insertBefore('#navbar-btn');

  var loginButtonString = '<a class="nav-link" id="login-btn">Login</a>';
  $('#navbar-btn').html(loginButtonString);
}
