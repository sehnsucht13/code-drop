const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.js");

// Retrieve all drops starred by the user
router.get("/:userId/stars", userController.getUserStars);

// Retrieve the profile of a user
router.get("/:userId/profile", userController.getUserProfile);

// Update the profile of a user
router.put("/:userId/profile", userController.updateUserProfile);

router.delete("/:userId", userController.deleteUser);

module.exports = router;
