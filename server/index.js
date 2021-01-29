require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const db = require("./models");

let app = express();

app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.json("Hello World from the server!");
});

app.post("/drops", (req, res) => {
  let title = req.body.title;
  let lang = req.body.lang;
  let visibility = req.body.visibility;
  let textBody = req.body.text;

  db.Drops.create({
    dropTitle: title,
    dropLanguage: lang,
    visibility: visibility,
    dropText: textBody,
  })
    .then((thing) => {
      console.log("thing", thing.dataValues.id);
      res.send("Created successfully").status(200);
    })
    .catch(() => {
      res.send("There was an error creating a new drop").status(400);
    });
  console.log("body", req.body);
  console.log("Received", title, lang, visibility, textBody);
});
app.delete("/drops/:dropId", (req, res) => {
  let dropId = req.params.dropId;
});
app.put("/drops/:dropId", (req, res) => {
  let dropId = req.params.dropId;
});

app.get("/drops", (req, res) => {
  res.json("Hello from drops get");
});

db.sequelize
  .sync()
  .then(() => {
    console.log("Connected to db");
    app.listen(process.env.HOST_PORT, function () {
      console.log(`Listening on port: ${process.env.HOST_PORT}`);
    });
  })
  .catch((err) => {
    console.log("There is an issue with the db conection", err);
  });
