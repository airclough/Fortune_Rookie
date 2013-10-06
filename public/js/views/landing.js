;(function() {
  App.Views.Landing = Backbone.View.extend({
    el      : '.content',
    template: _.template($('#landing').html()),
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });
}).call();
