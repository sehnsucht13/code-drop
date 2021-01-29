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

app.post("/drops", async (req, res) => {
  let title = req.body.title;
  let lang = req.body.lang;
  let visibility = req.body.visibility;
  let textBody = req.body.text;
  let annotations = req.body.annotations;
  console.log(
    "SERVER RECEIVED",
    title,
    lang,
    visibility,
    textBody,
    annotations
  );

  let dropRecordInfo = await db.Drops.create({
    dropTitle: title,
    dropLanguage: lang,
    visibility: visibility,
    dropText: textBody,
  });

  let newDropId = dropRecordInfo.dataValues.id;
  console.log(newDropId);

  annotations.forEach((annotation) => {
    db.DropAnnotations.create({
      startLine: annotation.start,
      endLine: annotation.end,
      annotation_text: annotation.text,
      dropId: newDropId,
    });
  });
  res.json({ id: newDropId }).status(200);
});

app.delete("/drops/:dropId", (req, res) => {
  let dropId = req.params.dropId;
});
app.put("/drops/:dropId", (req, res) => {
  let dropId = req.params.dropId;
});

app.get("/drops/:dropId", async (req, res) => {
  //res.json("Hello from drops get");
  let dropId = req.params.dropId;
  let dropRecord = await db.Drops.findByPk(dropId, {
    attributes: ["id", "dropTitle", "dropLanguage", "visibility", "dropText"],
  });
  console.log("Retrieve a record", dropRecord);
  let annotations = await db.DropAnnotations.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "dropId"],
    },
    where: {
      dropId: dropRecord.dataValues.id,
    },
  });
  console.log(
    "Annotations retrieve are",
    annotations.map((annotation) => annotation.dataValues)
  );

  const respObject = {
    codeDrop: dropRecord.dataValues,
    dropAnnotations: annotations.map((annotation) => annotation.dataValues),
  };
  res.json(respObject).status(200);
});

app.get("/drops/paginate", (req, res) => {
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
