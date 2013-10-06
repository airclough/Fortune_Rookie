;(function() {
  App.Views.DraftAppView = Backbone.View.extend({
    el: '.content',
    template: _.template($('#draftAppView').html()),
    initialize: function() {
      this.$el.html($('loading').html())
      this.subViews();
    },
    subViews: function() {
      var playerCollection = new App.Collections.PlayerCollection();

      playerCollection.fetch().then(function() {

        this.render();

        var playerCollectionView = new App.Views.PlayerCollectionView({collection: playerCollection})
          , playerFilterView     = new App.Views.PlayerFilterView();
      }.bind(this));
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
}).call();
