;(function(){
  App.Router = Backbone.Router.extend({
    routes: {
      ''     : 'index',
      'draft': 'draft'
    },
    index: function() {
      console.log('fortune rookie');
    },
    draft: function() {
      console.log('draft');
      App.Templates.Draft = new App.Views.DraftAppView();
    }
  })
}).call();
