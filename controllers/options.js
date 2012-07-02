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


/* options controller for the Options.html page */

var controller = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
  addUIListeners();
  renderOptions();
});

function renderOptions() {
  var options = controller.options();
  for (var name in options.checkboxes) {
    if (options.checkboxes[name]) {
      $('#' + name).trigger('click');
    } else {
      $('#' + name).trigger('change');
    }
  }
  for (var name in options.lists) {
    arr = options.lists[name];
    if (arr) {
      $('#' + name).val(arr.join(' '));
    }
  }
}

function addUIListeners() {
  var addSubdomainPreviewListener = function() {
    $('#extend_subdomains').on('change', function() {
      $('.news-item-domain').html($(this).is(':checked') ? ' (vlad.github.com) ' : ' (github.com) ');
    });
  };

  var addTextAreaListeners = function() {
    var setEditMode = function(id, enabled) {
      enabled ? $(id).removeAttr('disabled') : $(id).attr('disabled', 'disabled');
    };

    $('input[type="checkbox"]').on('change', function() {
      var checked = $(this).is(':checked');
      switch($(this).attr('id')) {
        case 'hide_domains':
          setEditMode('#hidden_domains_list', checked);
          break;
        case 'show_starred_usernames':
          setEditMode('#starred_usernames_list', checked);
          break;
      }
    });
  };

  var addSaveButtonListener = function() {
    document.querySelector('button').addEventListener('click', saveButtonClicked);
  };

  addSubdomainPreviewListener();
  addTextAreaListeners();
  addSaveButtonListener();
}

function saveButtonClicked() {
  var options = controller.options();

  for (var name in options.checkboxes) {
    options.checkboxes[name] = $('#' + name).is(':checked');
  }
  for (var name in options.lists) {
    options.lists[name] = $('#' + name).val();
  }

  options.save();
}