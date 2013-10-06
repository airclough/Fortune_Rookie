/*
 * players api
 */

var mongoClient   = require( 'mongodb' ).MongoClient
  , mongoObjectID = require( 'mongodb' ).ObjectID
  , mongoURI      = "mongodb://admin:admin@ds049548.mongolab.com:49548/heroku_app18507716"
  , api           = {};

exports.readAll = function(req, res) {
  var mongo = function(callback) {
    mongoClient.connect(mongoURI, function(err, mongo) {
      if(err) { return handler(err); }

      console.log('MongoDB CONNECTED.');

      api.mongo = mongo;
      return callback();
    });
  };
  var playersCollection = function(callback) {
    api.mongo.collection('players', function(err, collection) {
      if( err ) { return handler(err); }

      collection.find().sort({ 'draft.pick': 1 }).toArray( function( err, docs ) {
        if( err ) { return handler(err); }

        api.playersCollection = docs;
        return callback();
      });
    });
  };

  // init
  var fns = [mongo, playersCollection];
  async(fns.shift());

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
    return res.json(api.playersCollection);
  }
};
