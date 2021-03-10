const express = require("express");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

const router = express.Router();
const userController = require("../Controllers/user.js");

// Retrieve all drops starred by the user
router.get("/:userId/stars", userController.getUserStars);

// Retrieve the profile of a user
router.get("/:userId/profile", userController.getUserProfile);

// Update the profile of a user
router.put("/:userId/profile/description", userController.updateUserProfile);

router.post(
  "/:userId/profile/avatar",
  upload.single("avatar"),
  userController.updateAvatar
);

router.delete("/:userId", userController.deleteUser);

module.exports = router;
