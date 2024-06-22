const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser');


dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');

const dbConnection = require('./config/database');

// Routes 
const mountRoutes = require('./routes')

 

 

//Connect to db
dbConnection();

//Express App
const app = express();


// Enable other domains to access your application
app.use(cors())
app.options('*', cors());

// compress all responses
app.use(compression())
 
//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,'uploads')))
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode => ${process.env.NODE_ENV}`)

}

//
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//Mount routes
mountRoutes(app);

app.use('*', (req, res, next) => {
   next(new ApiError(`Can't find this EndPoint ${req.originalUrl} ` ,400))
})


//Global Error handle middleware
app.use(globalError)

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
}); 


//Event => list => cb  function

process.on('unhandledRejection', (err) => {
  console.log(`unhandledRejection Errors: ${err}`);
  server.close(() => {
    console.log("Shutting down ...")
    process.exit(1);
  })
}) 