;(function() {
  App.Views.LineupView = Backbone.View.extend({
    el: '#lineupForm',
    template: _.template($('#lineupForm').html()),
    events  : {
      'keyup #teamName': 'teamName',
      'submit'         : 'submit'
    },
    initialize: function() {
      this.sub();
      this.render();
      this.subViews();
    },
    sub: function() {
      this.$el.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.transitionEnd);

      this.model.on('invalid', this.invalid, this);
      App.Events.on('invalidLineup', this.invalid, this);
      App.Events.on('addPlayer', this.addPlayer, this);
      App.Events.on('scratchPlayer', this.scratchPlayer, this);
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    subViews: function() {
      this.draftPointsView();
      this.slotView();
    },
    draftPointsView: function() {
      this.pointsCapView = new App.Views.PointsCapView({ model: new App.Models.PointsCapModel() });
    },
    slotView: function() {
      var players = this.model.get('players');

      for(var key in players) {
        var slotView = new App.Views.SlotView({ model: players[key] });

        this.$el.find('#' + key).append(slotView.render().el);
      }
    },
    addPlayer: function(player) {
      switch(player.position) {
        case 'QB':
        case 'TE':
          this.addQBTE(player);
          break;
        case 'RB':
          this.addRB(player);
          break;
        case 'WR':
          this.addWR(player);
          break;
      }
    },
    addQBTE: function(player) {
      // guard clause - player already inserted
      if(this.doubleCheck(player)) { return false; }

      var pos       = player.position
        , model     = this.model.get('players')[pos]
        , pointHit  = model.get('player') ? player.points - model.get('player').points : player.points
        , pointsCap = this.model.get('pointsCap') - pointHit;

      if(this.model.set('pointsCap', pointsCap, { validate: true, silent: true })) {
        if(model.set('player', player)) {
          this.pointsCapView.model.set('pointsCap', pointsCap);
        }
      }
    },
    addRB: function(player) {
      // guard clause - player already inserted
      if(this.doubleCheck(player)) { return false; }

      var rb1       = this.model.get('players')['RB1']
        , rb2       = this.model.get('players')['RB2']
        , pointsHit = this.model.get('pointsCap') - player.points
        , that      = this;

      if(!(rb1.get('player'))) {
        openSlot(rb1);
      } else if(!(rb2.get('player'))) {
        openSlot(rb2);
      } else {
        return console.log('No empty slots!');
      }

      function openSlot(pos) {
        if(that.model.set('pointsCap', pointsHit, { validate: true, silent: true })) {
          if(pos.set('player', player)) {
            that.pointsCapView.model.set('pointsCap', pointsHit);
          }
        }
      }
    },
    addWR: function(player) {
      // guard clause - player already inserted
      if(this.doubleCheck(player)) { return false; }

      var wr1       = this.model.get('players')['WR1']
        , wr2       = this.model.get('players')['WR2']
        , pointsHit = this.model.get('pointsCap') - player.points
        , that      = this;

      if(!(wr1.get('player'))) {
        openSlot(wr1);
      } else if(!(wr2.get('player'))) {
        openSlot(wr2);
      } else {
        return console.log('No empty slots!');
      }

      function openSlot(pos) {
        if(that.model.set('pointsCap', pointsHit, { validate: true, silent: true })) {
          if(pos.set('player', player)) {
            that.pointsCapView.model.set('pointsCap', pointsHit);
          }
        }
      }
    },
    doubleCheck: function(player) {
      if( player.position.match(/RB/) || player.position.match(/WR/) ) {
        if( this.model.get('players')[player.position + '1'].id === player.id) { return true; }
        if( this.model.get('players')[player.position + '2'].id === player.id) { return true; }
      } else {
        if( this.model.get('players')[player.position].get('player')) {
          if( this.model.get('players')[player.position].get('player').id === player.id) {
            return true;
          }
        }
      }

      return false
    },
    scratchPlayer: function(attrs) {
      var players   = this.model.get('players')
        , pointsCap = this.model.get('pointsCap') + attrs.player.points
        , pos       = attrs.pos;

      if(players[pos].set('player', null)) {
        this.model.set('pointsCap', pointsCap, { validate: true, silent: true });
        this.pointsCapView.model.set('pointsCap', pointsCap);
      }
    },
    teamName: function() {
      var teamName = this.$el.find('#teamName').val();

      this.model.set('teamName', teamName, { silent: true });
    },
    transitionEnd: function() {
      $('.teamName').removeClass('borderFlash');
    },
    success: function(model, res, opts) {
      console.log(model);
      console.log(res);
      console.log(opts);

      $('.btn').removeClass('spin');
      App.Router.navigate('d3', { trigger: true });
    },
    error: function( model, xhr, opts ) {
      console.log(model);
      console.log(xhr);
      console.log(opts);

      $('.btn').removeClass('spin');
      App.Events.trigger('invalidLineup', { type: 'server', message: xhr.responseText });
    },
    submit: function( e ) {
      e.preventDefault();

      this.$el.find( '.btn' ).addClass( 'spin' );

      var team = {
        teamName: this.model.get( 'teamName' ),
        points  : this.model.get( 'pointsCap' ),
        QB      : this.model.get( 'players' )[ 'QB' ].get( 'player' ),
        RB1     : this.model.get( 'players' )[ 'RB1' ].get( 'player' ),
        RB2     : this.model.get( 'players' )[ 'RB2' ].get( 'player' ),
        WR1     : this.model.get( 'players' )[ 'WR1' ].get( 'player' ),
        WR2     : this.model.get( 'players' )[ 'WR2' ].get( 'player' ),
        TE      : this.model.get( 'players' )[ 'TE' ].get( 'player' )
      };

      this.model.save( team, {
        wait    : true,
        silent  : true,
        success : this.success,
        error   : this.error
      });
    }
  });
  App.Views.PointsCapView = Backbone.View.extend({
    el      : '.percent',
    template: function() {
      return '<span>' + this.model.get('pointsCap') + '</span>'
    },
    initialize: function() {
      this.sub();
      this.render();
    },
    sub: function() {
      this.$el.on( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.transitionEnd );

      this.model.on( 'change', this.render, this );
      App.Events.on( 'capped', this.capped, this );
    },
    render: function() {
      this.$el.html( this.template() );
      this.percent();
      return this;
    },
    percent: function() {
      var pointsCap = this.model.get('pointsCap')
        , percent   = pointsCap / 1000 * 100;

      this.$el.css({ width: percent + '%' });
    },
    capped: function(err) {
      this.$el.find('span').addClass('flash');
    },
    transitionEnd: function() {
      $('.percent').find('span').removeClass('flash');
    }
  });
  App.Views.SlotView = Backbone.View.extend({
    tagName       : 'div',
    className     : 'cf',
    emptyTemplate : _.template($('#emptySlot').html()),
    filledTemplate: _.template($('#filledSlot').html()),
    events: {
      'mouseover'     : 'showScratch',
      'mouseout'      : 'hideScratch',
      'click .scratch': 'scratchPlayer',
    },
    initialize: function() {
      this.sub();
    },
    sub: function() {
      this.$el.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', this.transitionEnd);

      this.model.on( 'change', this.render, this );
      App.Events.on( 'validateLineup', this.validateLineup, this );
    },
    render: function() {
      if( this.model.get('player')) {
        this.$el.html(this.filledTemplate(this.model.toJSON()));
        return this;
      } else {
        this.$el.html(this.emptyTemplate(this.model.toJSON()));
        return this;
      }
    },
    showScratch: function() {
      this.$el.find('.scratch').addClass('show');
    },
    hideScratch: function() {
      this.$el.find('.scratch').removeClass('show');
    },
    scratchPlayer: function() {
      var attrs = {
        pos   : this.model.get('position'),
        player: this.model.get('player')
      }

      if(this.model.set('player', null)) {
        App.Events.trigger('scratchPlayer', attrs);
      }
    },
    transitionEnd: function() {
      $('.name').removeClass('flash')
    },
    validateLineup: function( prop ) {
      if(this.model.get('position') === prop) {
        this.$el.find('.name').addClass('flash');
      }
    },
  });
}).call();
