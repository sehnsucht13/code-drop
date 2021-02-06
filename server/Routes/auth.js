const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

module.exports = (passportInstance) => {
  router.post("/register", async (req, res) => {
    let password = req.body.password;
    let username = req.body.username;
    // console.log("password and username for register", password, username);
    if (password === undefined || username === undefined) {
      res.status(401).json({ msg: "Password or Username are not provided" });
      console.log("returning");
      return;
    }

    let user = await req.app.locals.db.Users.findOne({
      where: {
        username: username,
      },
    });

    if (user !== null) {
      res.status(200).json({ status: "TAKEN" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = await req.app.locals.db.Users.create({
      username: username,
      password: hashedPassword,
    });
    // console.log("The new user created is", newUser);
    res.status(200).json({ status: "OK" });
  });

  router.post("/login", passportInstance.authenticate("local"), (req, res) => {
    // console.log("Successful auth with", req.body);
    res.status(200).end();
  });

  router.get("/session", function (req, res) {
    // console.log("Got the session route", req.user);
    res.send(req.user).status(200);
  });

  router.get("/logout", function (req, res) {
    // console.log("Got the logout route", req.user);
    if (req.user !== undefined) {
      req.logout();
      //   console.log("User logged out");
    }
    res.status(200).end();
  });

  return router;
};
