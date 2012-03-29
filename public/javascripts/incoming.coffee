
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

    listOfWords = transformToObject(topN)

    switch topN.source
       when "tweet.words" then window.topWordsView.sync(listOfWords)
       when "tweet.mentioned" then window.opinionLeaderView.sync(listOfWords)
  )

  updateClockTime = (tweet) ->
    ($ "#clocktime").html tweet.timeOfTweet

  updateTwitterMode = (twitterMode) ->
    ($ "#modetitle").html twitterMode.mode.toUpperCase()
    $keywords = ($ "#filterkeywords")
    $locations = ($ "#filterlocations")

    if twitterMode.mode is "Sample"
      console.log "true"
      $keywords.html "2% of all Tweets"
      $locations.html "Entire Globe"

    else
      console.log "false"
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

  transformToObject = (topNWords) ->

    rows = []
    for w, c of topNWords.topWords
      rows.push { title: w, count: c }

    _.sortBy(rows, (row) ->
        row.count * -1)

  limit = (coord)->
    if coord.length > 6 then coord.substring(0, 5) else coord


)
