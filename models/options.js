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

/* options model for storing / retrieving options in localStorage */

var Options = function() {
  var schema = {
    "checkboxes": ["extend_subdomains", "show_instant_profile", "hide_domains"],
    "lists": ["hidden_domains_list"]
  };

  this.iterate = function(block) {
    var self = this;
    for (var category in schema) {
      if (this[category]==undefined) {
        this[category] = {};
      }
      schema[category].forEach(function(name) {
        block(self, category, name);
      });
    }
  };

  this.load = function() {
    var cleanValue = function(category, value) {
      if (category=='checkboxes') {
        return value == undefined || value == 'true';
      } else {
        return value == undefined || value.trim() == '' ? [] : value.trim().split(/\s+/);
      }
    };

    this.iterate(function(self, category, name) {
      self[category][name] = cleanValue(category, localStorage['options_' + category + '_' + name]);
    });
  };

  this.save = function() {
    var valueToString = function(category, value) {
      if (category=='checkboxes') {
        return value.toString();
      } else {
        var arr = value.match(/[a-z\.\d-]+/g);
        return arr == null ? '' : arr.join(' ');
      }
    };

    this.iterate(function(self, category, name) {
      localStorage['options_' + category + '_' + name] = valueToString(category, self[category][name]);
    });
    this.load();
  };

  this.load();
};