// const User = require("./user");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./models");

module.exports = function (passport) {
  passport.use(
    // eslint-disable-line consistent-return
    new LocalStrategy(async (username, password, done) => {
      const user = await db.Users.findOne({ where: { username } });

      if (user === null) {
        return done(null, false);
      }

      bcrypt.compare(password, user.dataValues.password, (err, result) => {
        if (err) {
          console.log("error loggin in user");
          return done(null, false);
        }
        if (result === true) {
          return done(null, user);
        }
        return done(null, false);
      });
      return undefined;
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.dataValues.id);
  });
  passport.deserializeUser(async (id, cb) => {
    try {
      const user = await db.Users.findOne({ where: { id } });
      const userInformation = {
        username: user && user.username,
        uid: user && user.id,
      };
      cb(null, userInformation);
    } catch (err) {
      cb(err, null);
    }
  });
};
