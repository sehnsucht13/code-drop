const dropController = require("../Controllers/drop");
const starController = require("../Controllers/stars");
const commentController = require("../Controllers/comments");
const express = require("express");
const router = express.Router();

// GET
// Perform paginated search
router.get("/search", dropController.search);

// Return newest drops in paginated form
router.get("/paginate", dropController.paginate);

// Retrieve all the comments for a drop if they exist.
router.get("/:dropId/comments", commentController.getComments);

// Retrieve the contents of a single drop
router.get("/:dropId", dropController.getDrop);

// DELETE
// Delete a comment
router.delete("/:dropId/comments/:cId", commentController.deleteComment);

// Remove a star
router.delete("/:dropId/stars", starController.deleteStar);

// Delete a single drop
router.delete("/:dropId", dropController.deleteDrop);

// POST
// Create a new commetn
router.post("/:dropId/comments", commentController.createComment);

// Create a new star
router.post("/:dropId/stars", starController.createStar);

// Create a new drop
router.post("/", dropController.createDrop);

// PUT
// Update a drop
router.put("/:dropId", dropController.updateDrop);

// Update a comment
router.put("/:dropId/comments/:commentId", commentController.updateComment);

module.exports = router;
