(function() {

  $(function() {
    var calculatePercentage, changeBaseToMaxValueAsOne, flattenToArray, limit, socket, sortByCountDescending, transformAggregates, transformRetweets, transformToObject, transformTopCountries, updateClockTime, updateMap, updateTwitterMode;
    window.socket = socket = io.connect("http://localhost:3000");
    socket.on("com.berico.tweetstream.TwitterStreamMode", function(data) {
      var twitterMode;
      twitterMode = $.parseJSON(data);
      return updateTwitterMode(twitterMode);
    });
    socket.on("com.berico.tweetstream.Tweet", function(data) {
      var tweet;
      tweet = $.parseJSON(data);
      return updateClockTime(tweet);
    });
    socket.on("com.berico.tweetstream.wordcount.TopNWords", function(data) {
      var listOfWords, topN;
      topN = $.parseJSON(data);
      listOfWords = transformToObject(topN);
      switch (topN.source) {
        case "tweet.words":
          return window.topWordsView.sync(listOfWords);
        case "tweet.mentioned":
          return window.opinionLeaderView.sync(listOfWords);
      }
    });
    socket.on("com.berico.tweetstream.retweet.TopRetweets", function(data) {
      var retweetContainer, sortedRetweets;
      retweetContainer = $.parseJSON(data);
      sortedRetweets = transformRetweets(retweetContainer);
      return window.topRetweetsView.sync(sortedRetweets);
    });
    socket.on("com.berico.tweetstream.handlers.TopicMatchAggregateSet", function(data) {
      var aggregateSet, sortedAggregates;
      aggregateSet = $.parseJSON(data);
      sortedAggregates = transformAggregates(aggregateSet);
      return window.topNewsMatchersView.sync(sortedAggregates);
    });
    socket.on("com.berico.tweetstream.geo.TopNCountries", function(data) {
      var sortedTopCountries, topNCountries;
      topNCountries = $.parseJSON(data);
      sortedTopCountries = transformTopCountries(topNCountries);
      switch (topNCountries.source) {
        case "mention.locations":
          return window.topLocationsAboutView.sync(sortedTopCountries);
        case "all.mention.locations":
          return updateMap(sortedTopCountries, window.mapabout, "#f3d686", "#fd2d06");
        case "user.locations":
          return window.topLocationsFromView.sync(sortedTopCountries);
        case "all.user.locations":
          return updateMap(sortedTopCountries, window.mapfrom, "#bef8eb", "#270bf9");
      }
    });
    updateClockTime = function(tweet) {
      return ($("#clocktime")).html(tweet.timeOfTweet);
    };
    updateTwitterMode = function(twitterMode) {
      var $keywords1, $keywords2, $locations, $streamstate, count, even, keyword, lat, location, lon, setName, _i, _j, _len, _len2, _ref, _ref2, _results;
      ($("#modetitle")).html(twitterMode.mode.toUpperCase());
      $keywords1 = $("#filterscol1");
      $keywords2 = $("#filterscol2");
      $locations = $("#filterlocations");
      $streamstate = $("#streamstate");
      $streamstate.html(twitterMode.state.toUpperCase());
      if (twitterMode.mode === "Sample") {
        $keywords1.html("2% of all Tweets");
        $keywords2.html("");
        return $locations.html("Entire Globe");
      } else {
        $keywords1.html("");
        $keywords2.html("");
        $locations.html("");
        count = 0;
        _ref = twitterMode.keywords;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          keyword = _ref[_i];
          count++;
          if ((count % 2) === 0) {
            $keywords1.append("" + keyword + "<br />");
          } else {
            $keywords2.append("" + keyword + "<br />");
          }
        }
        $locations.append("Bounding Box 1<br />");
        count = 0;
        _ref2 = twitterMode.locations;
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          location = _ref2[_j];
          count++;
          even = (count % 2) === 0;
          setName = even ? "SW: " : "NE: ";
          if (even && count > 2) {
            $locations.append("Bounding Box " + ((count % 2) + 1) + "<br />");
          }
          $locations.append(setName);
          lon = limit(location[0] + "");
          lat = limit(location[1] + "");
          _results.push($locations.append("" + lat + ", " + lon + "<br />"));
        }
        return _results;
      }
    };
    updateMap = function(countries, map, minColor, maxColor) {
      var carray, normcountries;
      normcountries = changeBaseToMaxValueAsOne(countries);
      carray = flattenToArray(normcountries);
      return updateColors(map, carray, minColor, maxColor);
    };
    transformRetweets = function(retweetContainer) {
      var rows, tweet, _i, _len, _ref;
      rows = [];
      _ref = retweetContainer.topRetweets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tweet = _ref[_i];
        rows.push({
          text: tweet.message,
          count: tweet.retweetCount,
          user: tweet.user.userId,
          time: tweet.timeOfTweet
        });
      }
      return sortByCountDescending(rows);
    };
    transformToObject = function(topNWords) {
      var c, rows, w, _ref;
      rows = [];
      _ref = topNWords.topWords;
      for (w in _ref) {
        c = _ref[w];
        rows.push({
          title: w,
          count: c
        });
      }
      return sortByCountDescending(rows);
    };
    transformAggregates = function(aggregateContainer) {
      var aggregate, rows, _i, _len, _ref;
      rows = [];
      _ref = aggregateContainer.topicMatchAggregates;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        aggregate = _ref[_i];
        rows.push({
          description: aggregate.description,
          count: aggregate.numberOfTopicMatches,
          total: aggregate.numberOfItemsSeen,
          percentage: calculatePercentage(aggregate)
        });
      }
      return sortByCountDescending(rows);
    };
    transformTopCountries = function(topCountriesContainer) {
      var country, rows, _i, _len, _ref;
      rows = [];
      _ref = topCountriesContainer.topCountries;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        country = _ref[_i];
        rows.push({
          country: country.country,
          cc: country.countryCode,
          count: country.count
        });
      }
      return sortByCountDescending(rows);
    };
    changeBaseToMaxValueAsOne = function(sortedList) {
      var item, maxvalue, _i, _len;
      maxvalue = sortedList[0].count;
      for (_i = 0, _len = sortedList.length; _i < _len; _i++) {
        item = sortedList[_i];
        item.norm = item.count / maxvalue;
      }
      return sortedList;
    };
    flattenToArray = function(countries) {
      var cntry, rows, _i, _len;
      rows = {};
      for (_i = 0, _len = countries.length; _i < _len; _i++) {
        cntry = countries[_i];
        rows[cntry.cc] = cntry.norm;
      }
      return rows;
    };
    calculatePercentage = function(aggregate) {
      var denominator, numerator, value;
      denominator = aggregate.numberOfItemsSeen > 0 ? aggregate.numberOfItemsSeen : -1;
      numerator = aggregate.numberOfTopicMatches;
      value = denominator === -1 ? 0 : numerator / denominator;
      return limit(value + "");
    };
    limit = function(coord) {
      if (coord.length > 6) {
        return coord.substring(0, 5);
      } else {
        return coord;
      }
    };
    return sortByCountDescending = function(rows) {
      return _.sortBy(rows, function(row) {
        return row.count * -1;
      });
    };
  });

}).call(this);
