const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SessionStore = require("express-session-sequelize")(session.Store);
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

const app = express();
app.locals.db = db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsConfig = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsConfig));

// Init session storage
const sequelizeSessionStore = new SessionStore({
  db: db.sequelize,
});
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    saveUninitialized: true,
    resave: false,
    store: sequelizeSessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 1000 * 60 * 60 * 48,
    },
  })
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);
app.use(express.static(path.join("frontend/build")));

const auth = require("./Routes/auth")(passport);
const drop = require("./Routes/drop");
const user = require("./Routes/user");
app.use("/api/auth", auth);
app.use("/api/drop", drop);
app.use("/api/user", user);

if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    // res.status(200).json({ message: "Hello world from my heroku instance!" });
    console.log("SERVING");
    console.debug(path.join(__dirname + "/frontend/build/index.html"));
    res.status(200).sendFile(path.join("/frontend/build/index.html"));
  });
}

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
