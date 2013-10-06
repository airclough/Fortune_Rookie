/*
 * lineups api
 */

var mongoClient   = require( 'mongodb' ).MongoClient
  , mongoObjectID = require( 'mongodb' ).ObjectID
  , mongoURI      = "mongodb://admin:admin@ds049548.mongolab.com:49548/heroku_app18507716"
  , api           = {};

// post /api/draft
exports.create = function(req, res) {
  mongoClient.connect(mongoURI, function(err, mongo) {
    if(!err) {
      mongo.collection('lineups', function(err, collection) {
        if(!err) {
          var lineup = {
            teamName: req.body.teamName,
            points  : req.body.points,
            lineup  : {
              QB : req.body.QB,
              RB1: req.body.RB1,
              RB2: req.body.RB2,
              WR1: req.body.WR1,
              WR2: req.body.WR2,
              TE : req.body.TE
            }
          };

          collection.insert(lineup, function(err, doc) {
            if( !err ) {
              mongo.close();
              return res.json(doc[0]);
            } else {
              return console.log(err);
            }
          });
        } else {
          return console.log(err);
        }
      });
    } else {
      return console.log(err);
    }
  });
};
