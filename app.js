
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , amqp = require('amqp')
  , MemoryStore = express.session.MemoryStore
  , sessionStore = new MemoryStore()
  , parseCookie = require('connect').utils.parseCookie
  , app = module.exports = express.createServer()
  , io = require('socket.io').listen(app)
  , connection = amqp.createConnection(
    { host: "localhost", port: 5672, username: "guest", password: "guest", vhost: "/" });

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(
       {store: sessionStore, secret: 'adf234iauscljn23', key: 'express.sid'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

io.set('log level', 1)
io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];
        // (literally) get the session data from the session store
        sessionStore.get(data.sessionID, function (err, session) {
            if (err || !session) {
                // if we cannot grab a session, turn down the connection
                accept('Error', false);
            } else {
                // save the session data and accept the connection
                data.session = session;
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){

    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

    connection.on('ready', function(){

        io.sockets.on('connection',
            function (socket) {
              console.log("New WebSocket Client Connected!");
        });

        var queue_name = "web-front-end";

            console.log("Registering Queue: " + queue_name);

            var q = connection.queue(queue_name, { exclusive: true }, function(){

            q.bind("pegasus", "com.berico.tweetstream.TwitterStreamMode")
            q.bind("pegasus", "com.berico.tweetstream.Tweet");
            q.bind("pegasus", "com.berico.tweetstream.wordcount.TopNWords");

            var tweetReceivedCount = 0;

            q.subscribe(
                {ack:true},
                function(message, headers, deliveryInfo){

                    if(headers["pegasus.eventbus.event.topic"] == "com.berico.tweetstream.Tweet"){

                        if((++tweetReceivedCount % 50) == 0){

                            console.log("Another 50 'com.berico.tweetstream.Tweet' received");
                        }

                    } else {

                        console.log(headers["pegasus.eventbus.event.topic"]);
                    }


                    io.sockets.emit(headers["pegasus.eventbus.event.topic"], message.data.toString());
                    q.shift();
                });
            });

        console.log("AQMP Connection Ready");
    });
});

