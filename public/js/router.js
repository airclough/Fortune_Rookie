;(function(){
  App.Router = Backbone.Router.extend({
    routes: {
      ''     : 'draft',
      'd3'   : 'd3'
    },
    index: function() {
      console.log('fortune rookie');
      App.Templates.Landing = new App.Views.Landing();
    },
    draft: function() {
      console.log('draft');
      App.Templates.Draft = new App.Views.DraftAppView();
    },
    d3: function() {
      console.log('d3');
    }
  })
}).call();
