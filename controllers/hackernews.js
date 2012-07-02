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


/* processes a Hacker News page based on options requested from the app controller */
chrome.extension.sendRequest({'action': 'options'}, processPage);

function processPage(response) {
  var options = response;

  if (options.checkboxes.extend_subdomains || options.checkboxes.hide_domains) {

    var isExternalUrl = function(url) {
      return url && !$(this).attr('rel') && url.indexOf('//') != -1;
    };

    $('td.title a').each(function(index, element) {
      var url = $(this).attr('href');
      if (isExternalUrl(url)) {
        if (options.checkboxes.extend_subdomains) {
          $(this).next('.comhead').html(' (' + url.match(/\/\/(www\.|)([^\/]*)/)[2] + ') ');
        }
        if (options.checkboxes.hide_domains) {
          var $this = $(this);
          var domain = url.match(/\/\/([^\/]*)/)[1];
          console.log(options.lists.hidden_domains_list);
          options.lists.hidden_domains_list.forEach(function(element) {
            if (domain.indexOf(element) != -1) {
              var $tr = $this.parent().parent();
              $tr.next('tr').remove();
              $tr.next('tr').remove();
              $tr.remove();
            }
          });
        }
      }
    });
  }

  if (options.checkboxes.show_instant_profile) {
    $(".pagetop:last a[href^='user']").attr('id', 'profile_link');
    $('body').prepend("<div id='user_popup'><img src='' /><div id='user_description'></div><div id='user_links'><a id='user_submissions' href=''>submissions</a> | <a id='user_comments' href=''>comments</a></span></div>");
    var navColor = $('table tbody tr td:first').attr('bgcolor');
    $('#user_popup').css('border-color', navColor);
    $('#user_links').css('background-color', navColor);
    $('body').on('click', function(event) {
      $('#user_popup').hide();
    });

    $("a[href^='user']").on('click', function(event) {
      var extract = function(piece, html) {
        var ret = html.split(piece + ':</td><td>')[1].split('</td>')[0];
        return ret.indexOf('<textarea') == -1 ? $.trim(ret) : $.trim(ret.split('name="about">')[1].split('</textarea>')[0]).replace(/\n(.+)$/mg,'<p>$&</p>');
      };
      var linkify = function(html) {
        var shorten = function(str, max) {
          return str.length > max ? str.substr(0, max - 3) + "..." : str;
        };
        var wrapLink = function(str, p1, p2, offset, s) {
          var twitterHandle = getTwitterUsername(str);
          var linkText = twitterHandle != '' ? '@' + twitterHandle : shorten(str.trim(), 30);
          return "<a href='" + str.trim() + "'>" + linkText + "</a>";
        };
        var wrapMail = function(str, p1, p2, offset, s) {
          return " <a href='mailto:" + str.trim() + "'>" + str.trim() + "</a>";
        };
        var wrapTwitter = function(str, p1, p2, offset, s) {
          var putBack = str.substr(0, 1);
          str = str.substr(2);
          return putBack + "<a href='https://twitter.com/" + str.trim() + "'>@" + str.trim() + "</a>";
        };

        html = html.replace(/(http[\w\-\.\/:\?=&#;!]*[\w\/])/g, wrapLink);
        html = html.replace(/([a-zA-Z\d\-\+\.]+@[a-zA-Z\d\-\.]+[a-zA-z]+)/g, wrapMail);
        html = (' ' + html).replace(/[^a-zA-Z\d\-\+\.]@(\w+)/g, wrapTwitter).trim();
        return html;
      };

      var getTwitterUsername = function(str) {
        var matches = str.match(/twitter\.com[\/@#!]*(\w+)/);
        return matches != null ? matches[1] : '';
      };

      if ($(this).parent().hasClass('pagetop')) {
        return;
      }

      if (! $(this).parent().hasClass('popup-target') ) {
        $(this).wrap("<div class='popup-target' />");
      }

      $(this).css({'font-size': '11px', 'color': '#777'});
      var username = $(this).attr('href').split('=')[1];
      $(this).parent().append($('#user_popup'));
      $('#user_description').html('Loading...');
      $('#user_description').css('min-height', '0');
      $('#user_links').hide();
      $('#user_popup img').hide();
      $('.user-twitter').remove();

      $.get($(this).attr('href'), function(page) {
        $("a[href^='user?id=" + username + "']").not('#profile_link').html(username + ' (' + extract('karma', page) + ')');
        var description = linkify(extract('about', page));
        if (description != '') {
          $('#user_description').html(description);
          var twitterHandle = getTwitterUsername(description);
          if (twitterHandle != '') {
            $('#user_popup img').attr('src', 'https://api.twitter.com/1/users/profile_image?screen_name=' + twitterHandle + '&size=bigger');
            $('#user_popup img').show();
            $('#user_description').css('min-height', '76px');
            $('#user_description').html(description);
            $('#twitter-wjs').remove();
            $('.user-twitter').remove();
            $('#user_description').after("<div class='user-twitter'><a href='https://twitter.com/" + twitterHandle + "' class='twitter-follow-button' data-show-count='false' data-dnt='true'>Follow @" + twitterHandle + "</a></div><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='//platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');</script>");
          }
        }
        else {
          $('#user_description').html('<i>no profile</i>');
        }
        $('#user_submissions').attr('href', 'submitted?id=' + username);
        $('#user_comments').attr('href', 'threads?id=' + username);
        $('#user_links').show();
      });
      $('#user_popup').fadeIn(50);
      return false;
    });
  }
}