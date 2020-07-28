const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
var cors = require("cors");
const routes = require("./routes");
require("./db/index");

const app = express();

app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/api", routes);
app.post("/sd", (req, res) => {
  res.send(req.body);
});
app.listen(process.env.PORT, () =>
  console.log("Listening on port " + process.env.PORT)
);
