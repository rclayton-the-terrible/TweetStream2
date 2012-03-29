
$(()->


  TopItems = Backbone.Model.extend({

    defaults: {
      items: {"title": "None", "count": 0 } for num in [1..10]
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
      itemHtml = "<li><div class='norm'>#{item.title}<span class='count'>(#{item.count})</span></div><p class='linebreaker'>&nbsp;</p></li>"
      this.el.append itemHtml

    sync: (updatedSet)->
      this.topitems.set "items", updatedSet
      this.render()

    setElement: (element) ->
      this.el = element

  })

  window.opinionLeaderView = new TopItemsView({ el: $ "#topmentions" })
  window.topWordsView = new TopItemsView({ el: $ "#topwords" })
  window.topLocationsFromView = new TopItemsView({ el: $ "#toplocsfrom" })
  window.topLocationsAboutView = new TopItemsView({ el: $ "#toplocsabout" })
  window.topTweetsView = new TopItemsView({ el: $ "#toptweets" })
  window.topNewsView = new TopItemsView({ el: $ "#topnews" })

)