(function() {

  $(function() {
    var calculatePercentage, limit, socket, sortByCountDescending, transformAggregates, transformRetweets, transformToObject, updateClockTime, updateTwitterMode;
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
      console.dir(sortedRetweets);
      return window.topRetweetsView.sync(sortedRetweets);
    });
    socket.on("com.berico.tweetstream.handlers.TopicMatchAggregateSet", function(data) {
      var aggregateSet, sortedAggregates;
      aggregateSet = $.parseJSON(data);
      sortedAggregates = transformAggregates(aggregateSet);
      console.dir(sortedAggregates);
      return window.topNewsMatchersView.sync(sortedAggregates);
    });
    updateClockTime = function(tweet) {
      return ($("#clocktime")).html(tweet.timeOfTweet);
    };
    updateTwitterMode = function(twitterMode) {
      var $keywords, $locations, count, even, keyword, lat, location, lon, setName, _i, _j, _len, _len2, _ref, _ref2, _results;
      ($("#modetitle")).html(twitterMode.mode.toUpperCase());
      $keywords = $("#filterkeywords");
      $locations = $("#filterlocations");
      if (twitterMode.mode === "Sample") {
        $keywords.html("2% of all Tweets");
        return $locations.html("Entire Globe");
      } else {
        $keywords.html("");
        $locations.html("");
        count = 0;
        _ref = twitterMode.keywords;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          keyword = _ref[_i];
          count++;
          if (count < 10) $keywords.append("" + keyword + "<br />");
        }
        if (count >= 11) $keywords.append("...");
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
