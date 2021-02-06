// const User = require("./user");
const db = require("./models");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(async function (username, password, done) {
      // console.log("CALLED THE LOCAL STRAT");
      let user = await db.Users.findOne({ where: { username: username } });
      // console.log("LOCAL START USER", user);

      if (user === null) {
        // console.log("User not found");
        return done(null, false);
      }

      bcrypt.compare(password, user.dataValues.password, (err, result) => {
        if (err) {
          console.log("error loggin in user");
          return done(null, false);
        }
        if (result === true) {
          // console.log("Bcrypt compare is true");
          return done(null, user);
        } else {
          // console.log("Bcrypt compare is false");
          return done(null, false);
        }
      });
    })
  );

  passport.serializeUser((user, cb) => {
    // console.log("Serializing user", user.dataValues.id);
    cb(null, user.dataValues.id);
  });
  passport.deserializeUser(async (id, cb) => {
    // console.log("Deserializing", id);
    try {
      let user = await db.Users.findOne({ where: { id: id } });
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
