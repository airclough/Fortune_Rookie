;(function(){
  window.App = {
    Models     : {},
    Collections: {},
    Views      : {},
    Router     : {},
    Templates  : {},
    Events     : _.extend({}, Backbone.Events),
    set        : function() {
      this.Router = new App.Router();
      Backbone.history.start();
    }
  };
}).call();
