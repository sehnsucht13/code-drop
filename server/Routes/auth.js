const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../Controllers/auth");

module.exports = (passportInstance) => {
  router.post("/register", authController.registerUser);

  router.post("/login", passport.authenticate("local"), (req, res) => {
    res.status(200).end();
  });

  router.get("/session", authController.getUserSession);

  router.get("/logout", authController.logoutUser);

  return router;
};
