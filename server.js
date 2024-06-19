// BASE SETUP
// =============================================================================
const express   = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const jwt = require('jsonwebtoken');

var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var config = require('./config');
var cors = require('cors')

require("dotenv-safe").config();

// MongoDB Connection
// =============================================================================
var mongoObj = require('mongoose');

mongoObj.connect( config.database );

// mongoObj.connect(
//   config.database, 
// {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }
// );


var db = mongoObj.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to mongo database");
});

mongoObj.Promise = global.Promise;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT;   

// Middleware
// =============================================================================
var mWare=require('./middleware');
app.use(mWare);

// CORS
// =============================================================================
var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors());

// API Routes
// =============================================================================
var categoriesRoutes=require('./app/routes/CategoriesRoutes');
app.use('/api/category',categoriesRoutes
// #swagger.tags = ['Categories']
);

var videosRoutes=require('./app/routes/VideosRoutes');
app.use('/api/video',videosRoutes
/* 
#swagger.tags = ['Videos'] 
#swagger.security = [{
    "bearerAuth": []
}]
*/
);

var userRoutes=require('./app/routes/UserRoutes');
app.use('/api/user',userRoutes
// #swagger.tags = ['Users']
);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('------------------');
console.log('Using port ' + port);
console.log('------------------');