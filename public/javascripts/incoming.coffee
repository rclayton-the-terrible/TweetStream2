
$(()->
  window.socket = socket = io.connect("http://localhost:3000")

  socket.on("com.berico.tweetstream.TwitterStreamMode", (data) ->
      twitterMode = $.parseJSON data
      updateTwitterMode twitterMode
    )

  socket.on("com.berico.tweetstream.Tweet", (data) ->
    tweet = $.parseJSON data
    updateClockTime tweet
  )

  socket.on("com.berico.tweetstream.wordcount.TopNWords", (data) ->

    topN = $.parseJSON data

    listOfWords = transformToObject topN

    switch topN.source
       when "tweet.words" then window.topWordsView.sync(listOfWords)
       when "tweet.mentioned" then window.opinionLeaderView.sync(listOfWords)
  )

  socket.on("com.berico.tweetstream.retweet.TopRetweets", (data) ->

      retweetContainer = $.parseJSON data

      sortedRetweets = transformRetweets retweetContainer
      console.dir sortedRetweets
      window.topRetweetsView.sync sortedRetweets
    )

  socket.on("com.berico.tweetstream.handlers.TopicMatchAggregateSet", (data) ->

    aggregateSet = $.parseJSON data

    sortedAggregates = transformAggregates aggregateSet
    console.dir sortedAggregates

    window.topNewsMatchersView.sync sortedAggregates
  )

  updateClockTime = (tweet) ->
    ($ "#clocktime").html tweet.timeOfTweet

  updateTwitterMode = (twitterMode) ->
    ($ "#modetitle").html twitterMode.mode.toUpperCase()
    $keywords = ($ "#filterkeywords")
    $locations = ($ "#filterlocations")

    if twitterMode.mode is "Sample"
      $keywords.html "2% of all Tweets"
      $locations.html "Entire Globe"

    else
      $keywords.html ""
      $locations.html ""

      count = 0

      for keyword in twitterMode.keywords
        count++
        if count < 10 then $keywords.append "#{keyword}<br />"

      if count >= 11 then $keywords.append "..."

      $locations.append("Bounding Box 1<br />")

      count = 0

      for location in twitterMode.locations
        count++
        even = (count % 2) == 0
        setName = if even then "SW: " else "NE: "
        if even and count > 2 then $locations.append("Bounding Box #{(count % 2) + 1}<br />")
        $locations.append setName
        lon = limit(location[0] + "")
        lat = limit(location[1] + "")
        $locations.append "#{lat}, #{lon}<br />"

  transformRetweets = (retweetContainer) ->
    rows = []
    for tweet in retweetContainer.topRetweets
      rows.push { text: tweet.message, count: tweet.retweetCount, user: tweet.user.userId, time: tweet.timeOfTweet }
    sortByCountDescending rows

  transformToObject = (topNWords) ->
    rows = []
    for w, c of topNWords.topWords
      rows.push { title: w, count: c }
    sortByCountDescending rows

    #{ "description": "None", "count": 0, "percentage": 0, "total": 0}
  transformAggregates = (aggregateContainer) ->
    rows = []
    for aggregate in aggregateContainer.topicMatchAggregates
      rows.push {
        description: aggregate.description,
        count: aggregate.numberOfTopicMatches,
        total: aggregate.numberOfItemsSeen,
        percentage: calculatePercentage(aggregate) }
    sortByCountDescending rows

  calculatePercentage = (aggregate) ->
    denominator = if aggregate.numberOfItemsSeen > 0 then aggregate.numberOfItemsSeen else -1
    numerator = aggregate.numberOfTopicMatches
    value = if denominator is -1 then 0 else (numerator / denominator)
    limit value + ""

  limit = (coord)->
    if coord.length > 6 then coord.substring(0, 5) else coord

  sortByCountDescending = (rows) ->
    _.sortBy(rows, (row) ->
            row.count * -1)


)
