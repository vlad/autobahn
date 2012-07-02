/*
  Autobahn
    - a new Google Chrome extension for Hacker News
    - http://vlad.github.com/autobahn

  Vlad Yazhbin
    - Developer and Designer
    - http://vlad.github.com
    - http://twitter.com/vla

  Copyright 2012 Vlad Yazhbin.
*/

/* app (background page) controller replies to the HN script with up-to-date user options */

var _options;

function options() {
  return _options || loadOptions();
}

function loadOptions() {
  _options = new Options();
  return _options;
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.action == 'options') {
      sendResponse(options());
    }
  }
);

