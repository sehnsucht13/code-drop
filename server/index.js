require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const db = require("./models");

let app = express();

app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

app.post("/register", async (req, res) => {
  let password = req.body.password;
  let username = req.body.username;
  if (!password || !username) {
    res.json({ msg: "Password or Username are not provided" }).status(401);
  }
  let user = await db.Users.findOne({
    where: {
      username: username,
    },
  });
  if (user !== null) {
    res.json({ msg: "This username is already taken!" });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser = db.Users.create({
    username: username,
    password: hashedPassword,
  });
  console.log("The new user created is", newUser);
  res.json({ msg: "User created successfully!" }).status(200);
});

app.post("/login");

app.get("/", function (req, res) {
  res.json("Hello World from the server!");
});

app.post("/drops", async (req, res) => {
  let title = req.body.title;
  let lang = req.body.lang;
  let visibility = req.body.visibility;
  let textBody = req.body.text;
  let description = req.body.description;
  let annotations = req.body.annotations;
  console.log(
    "SERVER RECEIVED",
    title,
    lang,
    visibility,
    textBody,
    description,
    annotations
  );

  let dropRecordInfo = await db.Drops.create({
    title: title,
    lang: lang,
    visibility: visibility,
    text: textBody,
    description: description,
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

app.get("/drops/paginate", async (req, res) => {
  // TODO: Use try/catch here to turn params into int in case it fails.
  const pageStart = parseInt(req.query.start || 0);
  const pageLimit = parseInt(req.query.count || 15);

  if (isNaN(pageStart) || isNaN(pageLimit)) {
    res.status(400);
  } else {
    let rows = await db.Drops.findAll({
      offset: pageStart,
      limit: pageLimit,
      where: { visibility: 1 },
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "title", "description", "lang", "updatedAt"],
    });
    console.log("Rows from paginate are", rows);
    res.json(rows.map((row) => row.dataValues));
  }
});

app.get("/drops/search", async (req, res) => {
  console.log(req.query);
  res.json({ status: "found" }).status(200);
});

app.get("/drops/:dropId", async (req, res) => {
  //res.json("Hello from drops get");
  let dropId = req.params.dropId;
  let dropRecord = await db.Drops.findByPk(dropId, {
    attributes: ["id", "title", "lang", "visibility", "text", "description"],
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
