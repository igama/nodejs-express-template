
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  i18n = require("i18n");

var app = module.exports = express();

var env = process.env.NODE_ENV || 'development';

/**
 * Configuration
 */

//i18n : https://github.com/mashpie/i18n-node
i18n.configure({
    locales:['en', 'de'],
    directory: __dirname + '/locales'
});

// default: using 'accept-language' header to guess language settings
app.use(i18n.init); // Should always before app.route


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.compress()); //Gzip
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'app')));
app.use(app.router);

//process.env.NODE_ENV
//Development
app.configure('development', function(){
	console.log(':: Development Mode');
  app.use(express.logger('dev'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


//Production
app.configure('production', function(){
  app.use(express.errorHandler());
});


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/:name.html', routes.partials);

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
	res.status(404).render('404.jade');
});


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log(':: Express server listening on port ' + app.get('port'));
});
