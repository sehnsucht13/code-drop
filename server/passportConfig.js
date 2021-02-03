// const User = require("./user");
const db = require("./models");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  console.log("db object is", db);
  passport.use(
    new localStrategy(async (username, password, done) => {
      let user = await db.Users.findOne({ where: { username: username } });

      if (user === null) {
        return done(null, false);
      }

      bcrypt.compare(password, user.dataValues.password, (err, result) => {
        if (err) {
          console.log("error loggin in user");
        }
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.dataValues.id);
  });
  passport.deserializeUser((id, cb) => {
    console.log("Deserializing", id);
    db.Users.findOne({ where: { id: id } }, (err, user) => {
      console.log("from deserialize, ", err, user);
      const userInformation = {
        username: user && user.username,
      };
      cb(err, userInformation);
    });
  });
};
