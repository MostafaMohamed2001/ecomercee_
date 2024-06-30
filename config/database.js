
const mongoose = require('mongoose');
const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Connected to DB => ${conn.connection.name}`);
    console.log(`Connected to DB on host => ${conn.connection.host}`);
  }).catch((err) => {
    console.error(`Error connecting to DB ${err}`);
    process.exit(1);
  }); 
}
module.exports = dbConnection;  