const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

let app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(process.env.HOST_PORT, function () {
  console.log(`Listening on port: ${process.env.HOST_PORT}`);
});
