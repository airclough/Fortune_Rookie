;(function() {
  App.Models.PlayerModel = Backbone.Model.extend();
  App.Models.SlotModel   = Backbone.Model.extend({
    defaults: {
      player: null
    }
  });
  App.Models.LineupModel = Backbone.Model.extend({
    urlRoot: '/api/draft',
    idAttribute: '_id',
    defaults: {
      teamName  : null,
      pointsCap : 1000,
      players   : {
        'QB'  : new App.Models.SlotModel({ position: 'QB' }),
        'RB1' : new App.Models.SlotModel({ position: 'RB1' }),
        'RB2' : new App.Models.SlotModel({ position: 'RB2' }),
        'WR1' : new App.Models.SlotModel({ position: 'WR1' }),
        'WR2' : new App.Models.SlotModel({ position: 'WR2' }),
        'TE'  : new App.Models.SlotModel({ position: 'TE' })
      }
    },
    validate: function( attrs ) {
      if( attrs[ 'salaryCap' ] < 0 ) { return { type: 'capped', message: 'Not enough cash.' }; }
    }
  });
  App.Models.PointsCapModel = Backbone.Model.extend({
    defaults: {
      pointsCap: 1000
    }
  });
}).call();
