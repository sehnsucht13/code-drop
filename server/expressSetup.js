const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./models");

let app = express();
app.locals.db = db;

app.use(cors());
app.use(bodyParser.json());
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

const auth = require("./Routes/auth")(passport);
const drop = require("./Routes/drop");
const user = require("./Routes/user");
app.use("/auth", auth);
app.use("/drop", drop);
app.use("/user", user);

function startServer() {
  db.sequelize
    .sync()
    .then(() => {
      app.listen(process.env.HOST_PORT, function () {
        console.log(`Listening on port: ${process.env.HOST_PORT}`);
      });
    })
    .catch((err) => {
      console.error("There is an issue with the db conection", err);
    });
}

module.exports = { app: app, startServer: startServer };
