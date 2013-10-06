;(function() {
  App.Views.PlayerCollectionView = Backbone.View.extend({
    el        : '.playersList',
    initialize: function() {
      this.render();
    },
    render: function() {
      this.collection.each(this.addOne, this);
      return this;
    },
    addOne: function(model) {
      var playerModelView = new App.Views.PlayerModelView({model:model});

      this.$el.append(playerModelView.render().el);
    }
  });
  App.Views.PlayerModelView = Backbone.View.extend({
    tagName   : 'li',
    template  : _.template($('#playerModelView').html()),
    events    : {
      'click': 'addPlayer'
    },
    initialize: function() {
      this.sub();
      this.render();
    },
    sub   : function() {
      App.Events.on('roundFilter', this.toggleVisible, this)
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    addPlayer: function(e) {
      App.Events.trigger('addPlayer', this.model.toJSON());
    },
    toggleVisible: function(round) {
      this.$el.toggleClass( 'hide', this.isVisible(round));
    },
    isVisible: function(round) {
      return !(parseInt(round) === this.model.get('draft').round);
    }
  });
  App.Views.PlayerFilterView = Backbone.View.extend({
    el      : '.roundFilter',
    elements: {},
    events  : {
      'click li': 'roundFilter'
    },
    initialize: function() {
      this.cache();
    },
    cache: function() {
      this.elements.$round = this.$('li');
    },
    roundFilter: function(e) {
      Array.prototype.slice.call( this.elements.$round ).forEach(function(el, i) {
        var $el    = $(el)
          , filter = ($el.attr('id') === e.currentTarget.id);

        $el.find('span').toggleClass('warning', filter);
      });

      App.Events.trigger('roundFilter', e.currentTarget.id);
    }
  });
}).call();
