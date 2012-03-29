(function() {

  $(function() {
    var TopItems, TopItemsView, num;
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
        itemHtml = "<li><div class='norm'>" + item.title + "<span class='count'>(" + item.count + ")</span></div><p class='linebreaker'>&nbsp;</p></li>";
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
    window.topTweetsView = new TopItemsView({
      el: $("#toptweets")
    });
    return window.topNewsView = new TopItemsView({
      el: $("#topnews")
    });
  });

}).call(this);
