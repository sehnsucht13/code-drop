const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db = require("./models");

let PORT = undefined;
// Necessary since heroku provides its own port number
switch (process.env.NODE_ENV) {
  case "dev":
    PORT = process.env.DEV_PORT;
    break;
  case "test":
    PORT = process.env.DEV_PORT;
    break;
  case "production":
    PORT = process.env.PORT;
    break;
  default:
    PORT = process.env.DEV_PORT;
    break;
}

if (PORT === undefined) {
  throw new Error("PORT variable was not set!");
}

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
      app.listen(PORT, function () {
        console.log(`Listening on port: ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("There is an issue with the db conection", err);
    });
}

module.exports = { app: app, db: db, startServer: startServer };
