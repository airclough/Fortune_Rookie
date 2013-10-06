/**
 *  teams collection
 */

var request       = require( 'request' )
  , xml2js        = require('xml2js').parseString
  , mongoClient   = require( 'mongodb' ).MongoClient
  , mongoObjectID = require( 'mongodb' ).ObjectID
  , mongoURI      = "mongodb://admin:admin@ds049548.mongolab.com:49548/heroku_app18507716"
  , results       = { afc: [], nfc: [] };

var mongo = function(callback) {
  mongoClient.connect(mongoURI, function(err, mongo) {
    if(err) { return handler(err); }

    console.log('MongoDB CONNECTED.');

    results.mongo = mongo;
    return callback();
  });
}

var sportsData = function(callback) {
  url = "http://api.sportsdatallc.org/nfl-t1/teams/hierarchy.xml?api_key=dqsavf3zz453hhs9ewe6gqdz";

  request(url, function(err, res, xml) {
    if(err) { return handler( err ) }

    xml2js(xml, function(err, obj){
      var afc = obj.league.conference[0].division
        , nfc = obj.league.conference[1].division

      results.afc = conference(afc);
      results.nfc = conference(nfc);

      function conference(con) {
        var teams = [];

        for(var i = 0; i < con.length; i++) {
          var div = con[i].team;

          for(var j = 0; j < div.length; j++) {
            teams.push(div[j]['$']);
          }
        }

        return teams;
      }
    });

    return callback();
  });
}

// init
// var fns = [mongo, sportsData];
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
  console.log('seeding mongo..');

  results.mongo.collection('teams', function(err, collection){
    if(err) { return handler(err); }

    collection.insert(results.nfc, function(err, docs){
      if(err) { return handler(err); }

      results.mongo.close();
      return console.log('mongo seeded.')
    });
  });
}

// error handler
function handler(err) {
  console.log(err);
}
