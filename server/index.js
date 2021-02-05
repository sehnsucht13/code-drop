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
const { Users, Drops } = require("./models");

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
require("./passportConfig")(passport);

app.post("/register", async (req, res) => {
  let password = req.body.password;
  let username = req.body.username;
  console.log("password and username for register", password, username);
  if (!password || !username) {
    res.json({ msg: "Password or Username are not provided" }).status(401);
  }
  let user = await db.Users.findOne({
    where: {
      username: username,
    },
  });
  if (user !== null) {
    res
      .json({ status: "TAKEN", msg: "This username is already taken!" })
      .status(200);
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser = await db.Users.create({
    username: username,
    password: hashedPassword,
  });
  console.log("The new user created is", newUser);
  res.json({ status: "OK", msg: "User created successfully!" }).status(200);
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Successful auth with", req.body);
  res.status(200).end();
});

app.get("/auth", function (req, res) {
  console.log("Got the user route", req.user);
  res.send(req.user);
});

app.get("/logout", function (req, res) {
  console.log("Got the logout route", req.user);
  if (req.user !== undefined) {
    req.logout();
    console.log("User logged out");
  }
  res.status(200).end();
});

app.get("/", function (req, res) {
  res.json("Hello World from the server!");
});

app.post("/drop/:dropId/comments", async (req, res) => {
  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  const commentBody = req.body.text || "";
  const dropId = req.params.dropId;
  if (commentBody.length === 0) {
    res.status(400).end();
    return;
  }
  let dropCount = await db.Drops.count({ where: { id: dropId } });
  if (dropCount === 0) {
    res.status(404).end();
    return;
  }
  // console.log("Counted", userCount);

  let commentModel = await db.Comments.create({
    text: commentBody,
    dropId: dropId,
    userId: req.user.uid,
  });
  if (commentModel === null) {
    res.status(500).end();
    return;
  }

  res.json({ id: commentModel.dataValues.id }).status(200);
});

app.post("/drop/:dropId/stars", async (req, res) => {
  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  const dropId = req.params.dropId;

  let dropCount = await db.Drops.count({ where: { id: dropId } });
  if (dropCount === 0) {
    res.status(404).end();
    return;
  }

  let starModel = await db.Stars.create({
    dropId: dropId,
    userId: req.user.uid,
  });
  if (commentModel === null) {
    res.status(500).end();
    return;
  }

  res.status(200).end();
});

app.post("/drop", async (req, res) => {
  let title = req.body.title;
  let lang = req.body.lang;
  let visibility = req.body.visibility;
  let textBody = req.body.text;
  let description = req.body.description || "";
  let annotations = req.body.annotations || [];

  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }

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
    userId: req.user.uid,
  });
  // Todo: Handle insertion error

  annotations.forEach((annotation) => {
    db.DropAnnotations.create({
      startLine: annotation.start,
      endLine: annotation.end,
      annotation_text: annotation.text,
      dropId: dropRecordInfo.dataValues.id,
      userId: req.user.uid,
    });
    // Todo: Handle insertion error
  });
  res.json({ id: dropRecordInfo.dataValues.id }).status(200);
});

app.delete("/drop/:dropId/comments/:cId", async (req, res) => {
  let dropId = req.params.dropId;
  let commentId = req.params.cId;

  if (user === undefined) {
    res.json({ msg: "Unauthorized" }).status(401);
    return;
  }
  let commentInstance = await db.Comments.findOne({
    where: { userId: user.uid, dropId: dropId, id: commentId },
  });
  // If the drop does not exist
  if (commentInstance === null) {
    res.status(404).end();
    return;
  }

  commentInstance.destroy();
  res.status(200).end();
});

app.delete("/drop/:dropId/stars", async (req, res) => {
  let dropId = req.params.dropId;

  if (user === undefined) {
    res.json({ msg: "Unauthorized" }).status(401);
    return;
  }
  let starInstance = await db.Stars.findOne({
    where: { userId: user.uid, dropId: dropId },
  });

  // If the drop does not exist
  if (starInstance === null) {
    res.status(404).end();
    return;
  }

  starInstance.destroy();
  res.status(200).end();
});

app.delete("/drop/:dropId", async (req, res) => {
  let dropId = req.params.dropId;
  let user = req.user;
  console.log("ID and user are", dropId, user);

  if (user === undefined) {
    res.json({ msg: "Unauthorized" }).status(401);
  } else {
    let drop = await db.Drops.findOne({
      where: { userId: user.uid, id: dropId },
    });
    // If the drop does not exist
    if (drop === null) {
      res.status(404).end();
      return;
    }

    drop.destroy();
    res.status(200).end();
  }
});

app.delete("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (req.user === undefined || req.user.uid !== userId) {
    res.status(401).end();
    return;
  }

  let userModel = db.Users.findByPk(userId);
  if (userModel === null) {
    res.status(200).end();
  } else {
    userModel.destroy();
    res.status(200).end();
  }
});

app.get("/users/:userId/stars", async (req, res) => {
  const userId = req.params.userId;
  if (req.user === undefined || req.user.uid !== userId) {
    res.status(404).end();
    return;
  }

  let starModel = db.Stars.findAll({ where: { userId: userId } });
  if (starModel === null) {
    res.json([]).status(200);
  } else {
    const starredDrops = starModel.map(async (star) => {
      const dropsModel = db.Drops.findOne({
        where: { id: star.dataValues.dropId },
        attributes: ["id", "title", "description", "lang"],
      });
      return dropsModel.dataValues;
    });
    res.json(starredDrops).status(200);
  }
});

app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (req.user === undefined || req.user.uid !== userId) {
    res.status(401).end();
    return;
  }

  let userModel = db.Users.findByPk(userId, {
    attributes: ["id", "text", "description", "numStars", "numForks"],
  });
  if (userModel === null) {
    res.status(404).end();
  } else {
    res.json(userModel.dataValues).status(200);
  }
});

app.get("/drops/:dropId/comments", async (req, res) => {
  const dropId = req.params.dropId;
  const comments = await db.Comments.findAll({
    where: { dropId: dropId },
    attributes: ["id", "text", "updatedAt", "userId"],
  });
  if (comments !== null) {
    const filteredComments = comments.map(async (comment) => {
      const commentAuthor = await db.Users.findByPk(comment.dataValues.userId, {
        attributes: ["username"],
      });
      return { ...comment, username: commentAuthor.dataValues.username };
    });
    res.json(comments).status(200);
  }
  res.json({}).status(200);
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

app.get("/drop/:dropId", async (req, res) => {
  //res.json("Hello from drops get");
  let dropId = req.params.dropId;
  let dropRecord = await db.Drops.findByPk(dropId, {
    attributes: ["id", "title", "lang", "visibility", "text", "description"],
  });

  console.log("Retrieve a record", dropRecord);
  if (dropRecord === null) {
    res.status(400).end();
  } else {
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
  }
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
