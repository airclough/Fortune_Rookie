/**
 *  nfl players collection
 */

var request       = require( 'request' )
  , xml2js        = require('xml2js').parseString
  , mongoClient   = require( 'mongodb' ).MongoClient
  , mongoObjectID = require( 'mongodb' ).ObjectID
  , mongoURI      = "mongodb://admin:admin@ds049548.mongolab.com:49548/heroku_app18507716"
  , results       = { players: [] };

var mongo = function(callback) {
  mongoClient.connect(mongoURI, function(err, mongo) {
    if(err) { return handler(err); }

    console.log('MongoDB CONNECTED.');

    results.mongo = mongo;
    return callback();
  });
};

var teamsCollection = function(callback) {
  results.mongo.collection('teams', function(err, collection) {
    if(err) { return handler( err ); }

    collection.find().toArray(function(err, docs) {
      if(err) { return handler( err ); }

      results.teams = docs;
      return callback();
    });
  });
};

var eachTeam = function(callback) {
  teamsAsync(results.teams.shift());

  function teamsAsync(team) {
    if(team) {
      sportsData(team, function(){
        teamsAsync(results.teams.shift());
      });
    } else {
      return callback();
    }
  }
}

function sportsData(team, callback) {
  url = 'http://api.sportsdatallc.org/nfl-t1/teams/' + team.id + '/roster.xml?api_key=dqsavf3zz453hhs9ewe6gqdz';

  request(url, function(err, res, xml) {
    if(err) { return handler( err ); }

    xml2js(xml, function(err, obj) {
      var teams = obj.team.player;

      for(var i = 0; i < teams.length; i++) {
        var player = teams[i]['$'];

        if(player.experience === '0') {
          results.players.push({
            id  : player.id,
            name: {
              first: player.name_first,
              last : player.name_last,
            },
            position: player.position,
            number  : player.jersey_number,
            draft   : {
              round  : player.draft_round,
              pick   : player.draft_pick,
              team   : player.draft_team,
              college: player.college
            },
            vitals: {
              height: player.height,
              weight: player.weight
            }
          });
        }
      }
    });

    return callback();
  });
};

// init
// var fns = [mongo, teamsCollection, eachTeam];
// async(fns.shift());

function async(fn) {
  if(fn) {
    fn(function(){
      async(fns.shift());
    });
  } else {
    return final();
  }
}

function final() {
  console.log('MongoDB seeding..');

  results.mongo.collection('players', function(err, collection) {
    if(err) { return handler(err); }

    collection.insert(results.players, function(err, docs) {
      if(err) { return handler(err); }

      results.mongo.close();
      return console.log('MongoDB seeded.')
    });
  });
}

// error handler
function handler(err) {
  console.log(err);
}
