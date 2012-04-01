
$(()->


  TopItems = Backbone.Model.extend({

    defaults: {
      items: {"title": "None", "count": 0 } for num in [1..10]
    }
  })

  TopRetweets = Backbone.Model.extend({

    defaults: {
      items: { "text": "None", "count": 0, "user": "Unknown", "time": "None"} for num in [1..25]
    }
  })

  TopNewsMatchers = Backbone.Model.extend({

    defaults: {
      items: { "description": "None", "count": 0, "percentage": 0, "total": 0} for num in [1..25]
    }
  })

  TopLocations = Backbone.Model.extend({

    defaults: {
      items: { "country": "None", "cc": "Unknown", "count": 0 } for num in [1..25]
    }
  })

  TopItemsView = Backbone.View.extend({

    initialize: ->
      _.bindAll this, "render", "sync"
      this.topitems = new TopItems()
      this.render()

    render: ->
      items = this.topitems.get "items"
      this.clear()
      this.renderItem item for item in items

    clear: ->
      this.el.html ""

    renderItem: (item) ->
      itemHtml = """
        <li>
          <div class='norm'>#{item.title}
            <span class='count'>(#{item.count})</span>
          </div>
          <p class='linebreaker'>&nbsp;</p>
        </li>
      """
      this.el.append itemHtml

    sync: (updatedSet)->
      this.topitems.set "items", updatedSet
      this.render()

    setElement: (element) ->
      this.el = element

  })

  TopRetweetsView = Backbone.View.extend({

    initialize: ->
      _.bindAll this, "render", "sync"
      this.topitems = new TopRetweets()
      this.render()

    render: ->
      items = this.topitems.get "items"
      this.clear()
      this.renderItem item for item in items

    clear: ->
      this.el.html ""

    renderItem: (item) ->
      itemHtml = """
        <li>
          <div class='user'>#{item.user}
            <span class='count'>(#{item.count})</span>
            <br />
            <span class='tweet'>#{item.text}</span>
            <br />
            <span class='retweettime'>#{item.time}</span>
          </div>
          <p class='linebreaker'>&nbsp;</p>
        </li>
      """
      this.el.append itemHtml

    sync: (updatedSet)->
      this.topitems.set "items", updatedSet
      this.render()

    setElement: (element) ->
      this.el = element

  })

  TopNewsMatchersView = Backbone.View.extend({

      initialize: ->
        _.bindAll this, "render", "sync"
        this.topitems = new TopNewsMatchers()
        this.render()

      render: ->
        items = this.topitems.get "items"
        this.clear()
        this.renderItem item for item in items

      clear: ->
        this.el.html ""

      renderItem: (item) ->
        percentsize = Math.round((item.percentage * 100) + 12)

        #{ "description": "None", "count": 0, "percentage": 0, "total": 0}
        itemHtml = """
                <li>
                  <div class='newstopic'>#{item.description}
                    <span class='count'>(#{item.count})</span>
                  </div>
                  <div class='percentlinebg'>
                    <span class='percentline' style='width: #{percentsize}px'>&nbsp;</span>
                  </div>
                  <table class='newsbottom' cellspacing='0' cellpadding='0'>
                    <tr>
                      <td class='percentvalue'>#{item.percentage}%</td>
                      <td class='totaltweets'>#{item.total}</td>
                    </tr>
                  </table>
                  <p class='linebreaker'>&nbsp;</p>
                </li>
              """
        this.el.append itemHtml

      sync: (updatedSet)->
        this.topitems.set "items", updatedSet
        this.render()

      setElement: (element) ->
        this.el = element

  })

  TopLocationsView = Backbone.View.extend({

      initialize: ->
        _.bindAll this, "render", "sync"
        this.topitems = new TopLocations()
        this.render()

      render: ->
        items = this.topitems.get "items"
        this.clear()
        this.renderItem item for item in items

      clear: ->
        this.el.html ""

      #{ "country": "None", "cc": "Unknown", "count": 0 }
      renderItem: (item) ->
        itemHtml = """
          <li>
            <div class='newstopic'>#{item.country} (#{item.cc})
            &nbsp;&nbsp;<span class='count'>(#{item.count})</span>
            </div>
            <p class='linebreaker'>&nbsp;</p>
          </li>
        """
        this.el.append itemHtml

      sync: (updatedSet)->
        this.topitems.set "items", updatedSet
        this.render()

      setElement: (element) ->
        this.el = element

    })

  window.opinionLeaderView = new TopItemsView({ el: $ "#topmentions" })
  window.topWordsView = new TopItemsView({ el: $ "#topwords" })
  window.topLocationsFromView = new TopLocationsView({ el: $ "#toplocsfrom" })
  window.topLocationsAboutView = new TopLocationsView({ el: $ "#toplocsabout" })
  window.topRetweetsView = new TopRetweetsView({ el: $ "#toptweets" })
  window.topNewsMatchersView = new TopNewsMatchersView({ el: $ "#topnews" })

)