const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

module.exports = (passportInstance) => {
  router.post("/register", async (req, res) => {
    let password = req.body.password;
    let username = req.body.username;
    if (password === undefined || username === undefined) {
      res.status(401).json({ msg: "Password or Username are not provided" });
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
    res.status(200).json({ status: "OK" });
  });

  router.post("/login", passportInstance.authenticate("local"), (req, res) => {
    res.status(200).end();
  });

  router.get("/session", function (req, res) {
    res.status(200).send(req.user);
  });

  router.get("/logout", function (req, res) {
    if (req.user !== undefined) {
      req.logout();
    }
    res.status(200).end();
  });

  return router;
};
