
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
      window.topRetweetsView.sync sortedRetweets
  )

  socket.on("com.berico.tweetstream.handlers.TopicMatchAggregateSet", (data) ->
    aggregateSet = $.parseJSON data
    sortedAggregates = transformAggregates aggregateSet
    window.topNewsMatchersView.sync sortedAggregates
  )

  socket.on("com.berico.tweetstream.geo.TopNCountries", (data) ->
    topNCountries = $.parseJSON data
    sortedTopCountries = transformTopCountries topNCountries
    switch topNCountries.source
      when "mention.locations" then window.topLocationsAboutView.sync(sortedTopCountries)
      when "all.mention.locations" then updateMap sortedTopCountries, window.mapabout, "#f3d686", "#fd2d06"
      when "user.locations" then window.topLocationsFromView.sync(sortedTopCountries)
      when "all.user.locations" then updateMap sortedTopCountries, window.mapfrom, "#bef8eb", "#270bf9"

  )

  updateClockTime = (tweet) ->
    ($ "#clocktime").html tweet.timeOfTweet

  updateTwitterMode = (twitterMode) ->
    ($ "#modetitle").html twitterMode.mode.toUpperCase()
    $keywords1 = ($ "#filterscol1")
    $keywords2 = ($ "#filterscol2")
    $locations = ($ "#filterlocations")
    $streamstate = ($ "#streamstate")
    $streamstate.html twitterMode.state.toUpperCase()

    if twitterMode.mode is "Sample"
      $keywords1.html "2% of all Tweets"
      $keywords2.html ""
      $locations.html "Entire Globe"

    else
      $keywords1.html ""
      $keywords2.html ""
      $locations.html ""

      count = 0

      for keyword in twitterMode.keywords
        count++
        if (count % 2) == 0
          $keywords1.append "#{keyword}<br />"
        else
          $keywords2.append "#{keyword}<br />"

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

  updateMap = (countries, map, minColor, maxColor) ->
    normcountries = changeBaseToMaxValueAsOne countries
    carray = flattenToArray normcountries
    updateColors(map, carray, minColor, maxColor)

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

  transformAggregates = (aggregateContainer) ->
    rows = []
    for aggregate in aggregateContainer.topicMatchAggregates
      rows.push {
        description: aggregate.description,
        count: aggregate.numberOfTopicMatches,
        total: aggregate.numberOfItemsSeen,
        percentage: calculatePercentage(aggregate) }
    sortByCountDescending rows

  transformTopCountries = (topCountriesContainer) ->
    rows = []
    for country in topCountriesContainer.topCountries
      rows.push {
          country: country.country
          cc: country.countryCode
          count: country.count
      }
    sortByCountDescending rows

  changeBaseToMaxValueAsOne = (sortedList) ->
    maxvalue = sortedList[0].count
    for item in sortedList
      item.norm = (item.count / maxvalue)
    sortedList

  flattenToArray = (countries) ->
    rows = {}
    for cntry in countries
      #alert "#{cntry.cc} = #{cntry.norm}"
      rows[cntry.cc] = cntry.norm
    rows

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
