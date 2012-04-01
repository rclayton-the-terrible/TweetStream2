
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , httpProxy = require('http-proxy')
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

var proxy = new httpProxy.HttpProxy({ target: { host: "localhost", port: 8000 }});

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
app.all("/x/*", function(req, res){
    console.log("Proxying Request");
    req.url = req.url.substring(2);
    console.log(req.url)

    proxy.proxyRequest(req, res);
});


app.get('/', routes.index);

app.listen(3000, function(){

    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

    connection.on('ready', function(){

        io.sockets.on('connection',
            function (socket) {
              console.log("New WebSocket Client Connected!");
        });

            var qtweets = connection.queue("web-front-end--tweets", { exclusive: true }, function(){
                qtweets.bind("pegasus", "com.berico.tweetstream.Tweet");

                var tweetReceivedCount = 0;

                qtweets.subscribe(
                    {ack:true},
                    function(message, headers, deliveryInfo){
                        if((++tweetReceivedCount % 100) == 0){
                            console.log("RECEIVED: x100 com.berico.tweetstream.Tweet");
                        }
                        io.sockets.emit(headers["pegasus.eventbus.event.topic"], message.data.toString());
                        qtweets.shift();
                    });
            });

            var qstreammode = connection.queue("web-front-end--streammode", {exclusive: true}, function(){
                qstreammode.bind("pegasus", "com.berico.tweetstream.TwitterStreamMode")
                qstreammode.subscribe(
                {ack:true},
                function(message, headers, deliveryInfo){
                    console.log("RECEIVED: " + headers["pegasus.eventbus.event.topic"]);
                    io.sockets.emit(headers["pegasus.eventbus.event.topic"], message.data.toString());
                    qstreammode.shift();
                });
            });

            var qanalytics = connection.queue("web-front-end--analytics", {exclusive: true}, function(){
                qanalytics.bind("pegasus", "com.berico.tweetstream.wordcount.TopNWords");
                qanalytics.bind("pegasus", "com.berico.tweetstream.retweet.TopRetweets");
                qanalytics.bind("pegasus", "com.berico.tweetstream.handlers.TopicMatchAggregateSet");
                qanalytics.subscribe(
                {ack:true},
                function(message, headers, deliveryInfo){
                    console.log("RECEIVED: " + headers["pegasus.eventbus.event.topic"]);
                    io.sockets.emit(headers["pegasus.eventbus.event.topic"], message.data.toString());
                    qanalytics.shift();
                });
            });

            var qgeo = connection.queue("web-font-end--geo", {exclusive: true}, function(){
                qgeo.bind("pegasus", "com.berico.tweetstream.geo.TopNCountries");
                qgeo.subscribe(
                    {ack:true},
                    function(message, headers, deliveryInfo){
                        console.log("RECEIVED: " + headers["pegasus.eventbus.event.topic"]);
                        io.sockets.emit(headers["pegasus.eventbus.event.topic"], message.data.toString());
                        qgeo.shift();
                    }
                );
            });


        console.log("AQMP Connection Ready");
    });
});

