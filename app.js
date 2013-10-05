/**
 * Fortune Rookie Fantasy
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('fortune cookie'));
app.use(express.session({
  secret: 'fortune cookie',
  maxAge: 604800
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app)
  , io     = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
  socket.on('sweet', function(data){
    console.log(data);
  });
});

server.listen(3000);
