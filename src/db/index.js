//Import the mongoose module
var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB = `mongodb://127.0.0.1:27017/droom_api`;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
