(function() {

  $(function() {
    var TopItems, TopItemsView, TopNewsMatchers, TopNewsMatchersView, TopRetweets, TopRetweetsView, num;
    TopItems = Backbone.Model.extend({
      defaults: {
        items: (function() {
          var _results;
          _results = [];
          for (num = 1; num <= 10; num++) {
            _results.push({
              "title": "None",
              "count": 0
            });
          }
          return _results;
        })()
      }
    });
    TopRetweets = Backbone.Model.extend({
      defaults: {
        items: (function() {
          var _results;
          _results = [];
          for (num = 1; num <= 25; num++) {
            _results.push({
              "text": "None",
              "count": 0,
              "user": "Unknown",
              "time": "None"
            });
          }
          return _results;
        })()
      }
    });
    TopNewsMatchers = Backbone.Model.extend({
      defaults: {
        items: (function() {
          var _results;
          _results = [];
          for (num = 1; num <= 25; num++) {
            _results.push({
              "description": "None",
              "count": 0,
              "percentage": 0,
              "total": 0
            });
          }
          return _results;
        })()
      }
    });
    TopItemsView = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this, "render", "sync");
        this.topitems = new TopItems();
        return this.render();
      },
      render: function() {
        var item, items, _i, _len, _results;
        items = this.topitems.get("items");
        this.clear();
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(this.renderItem(item));
        }
        return _results;
      },
      clear: function() {
        return this.el.html("");
      },
      renderItem: function(item) {
        var itemHtml;
        itemHtml = "<li>\n  <div class='norm'>" + item.title + "\n    <span class='count'>(" + item.count + ")</span>\n  </div>\n  <p class='linebreaker'>&nbsp;</p>\n</li>";
        return this.el.append(itemHtml);
      },
      sync: function(updatedSet) {
        this.topitems.set("items", updatedSet);
        return this.render();
      },
      setElement: function(element) {
        return this.el = element;
      }
    });
    TopRetweetsView = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this, "render", "sync");
        this.topitems = new TopRetweets();
        return this.render();
      },
      render: function() {
        var item, items, _i, _len, _results;
        items = this.topitems.get("items");
        this.clear();
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(this.renderItem(item));
        }
        return _results;
      },
      clear: function() {
        return this.el.html("");
      },
      renderItem: function(item) {
        var itemHtml;
        itemHtml = "<li>\n  <div class='user'>" + item.user + "\n    <span class='count'>(" + item.count + ")</span>\n    <br />\n    <span class='tweet'>" + item.text + "</span>\n    <br />\n    <span class='retweettime'>" + item.time + "</span>\n  </div>\n  <p class='linebreaker'>&nbsp;</p>\n</li>";
        return this.el.append(itemHtml);
      },
      sync: function(updatedSet) {
        this.topitems.set("items", updatedSet);
        return this.render();
      },
      setElement: function(element) {
        return this.el = element;
      }
    });
    TopNewsMatchersView = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this, "render", "sync");
        this.topitems = new TopNewsMatchers();
        return this.render();
      },
      render: function() {
        var item, items, _i, _len, _results;
        items = this.topitems.get("items");
        this.clear();
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(this.renderItem(item));
        }
        return _results;
      },
      clear: function() {
        return this.el.html("");
      },
      renderItem: function(item) {
        var itemHtml, percentsize;
        percentsize = Math.round((item.percentage * 100) + 12);
        console.log(percentsize);
        itemHtml = "<li>\n  <div class='newstopic'>" + item.description + "\n    <span class='count'>(" + item.count + ")</span>\n  </div>\n  <div class='percentlinebg'>\n    <span class='percentline' style='width: " + percentsize + "px'>&nbsp;</span>\n  </div>\n  <table class='newsbottom' cellspacing='0' cellpadding='0'>\n    <tr>\n      <td class='percentvalue'>" + item.percentage + "%</td>\n      <td class='totaltweets'>" + item.total + "</td>\n    </tr>\n  </table>\n  <p class='linebreaker'>&nbsp;</p>\n</li>";
        return this.el.append(itemHtml);
      },
      sync: function(updatedSet) {
        this.topitems.set("items", updatedSet);
        return this.render();
      },
      setElement: function(element) {
        return this.el = element;
      }
    });
    window.opinionLeaderView = new TopItemsView({
      el: $("#topmentions")
    });
    window.topWordsView = new TopItemsView({
      el: $("#topwords")
    });
    window.topLocationsFromView = new TopItemsView({
      el: $("#toplocsfrom")
    });
    window.topLocationsAboutView = new TopItemsView({
      el: $("#toplocsabout")
    });
    window.topRetweetsView = new TopRetweetsView({
      el: $("#toptweets")
    });
    return window.topNewsMatchersView = new TopNewsMatchersView({
      el: $("#topnews")
    });
  });

}).call(this);
