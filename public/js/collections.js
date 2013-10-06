;(function() {
  App.Collections.PlayerCollection = Backbone.Collection.extend({
    model: App.Models.PlayerModel,
    comparator: function(a, b) {
      var round = a.get('draft').round - b.get('draft').round;

      if(round === 0) {
        return a.get('draft').pick < b.get('draft').pick ? -1 : 1;
      } else {
        return round;
      }
    },
    url: '/api/players'
  })
}).call();
