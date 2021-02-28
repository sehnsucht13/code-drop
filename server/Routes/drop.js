const dropController = require("../Controllers/drop");
const starController = require("../Controllers/stars");
const commentController = require("../Controllers/comments");
const express = require("express");
const router = express.Router();

// Perform paginated search
router.get("/search", dropController.search);

// Return newest drops in paginated form
router.get("/paginate", dropController.paginate);

// Retrieve all the comments for a drop if they exist.
router.get("/:dropId/comments", commentController.getComments);

// Retrieve the contents of a single drop
router.get("/:dropId", dropController.getDrop);

// Delete a comment
router.delete("/:dropId/comments/:cId", commentController.deleteComment);

// Remove a star
router.delete("/:dropId/stars", starController.deleteStar);

// Delete a single drop
router.delete("/:dropId", dropController.deleteDrop);

router.post("/:dropId/comments", commentController.createComment);

router.post("/:dropId/stars", starController.createStar);

router.post("/", dropController.createDrop);

router.put("/:dropId", dropController.updateDrop);

router.put("/:dropId/comments/:commentId", commentController.updateComment);

module.exports = router;
