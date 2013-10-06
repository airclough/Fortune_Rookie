;(function(){
  window.App = {
    Models     : {},
    Collections: {},
    Views      : {},
    Router     : {},
    Templates  : {},
    Session    : null,
    Events     : _.extend( {}, Backbone.Events),
    set        : function() {
      App.Router = new App.Router();
      Backbone.history.start();
    }
  };
}).call();
