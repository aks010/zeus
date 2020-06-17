const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
require("./db/index");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/api", routes);
app.post("/sd", (req, res) => {
  res.send(req.body);
});
app.listen(5000, () => console.log("Listening on port " + 5000));
