const express = require("express");
const router = express.Router();

// Perform a paginated search
router.get("/paginate", async (req, res) => {
  // TODO: Use try/catch here to turn params into int in case it fails.
  const pageStart = parseInt(req.query.start || 0);
  const pageLimit = parseInt(req.query.count || 15);

  if (isNaN(pageStart) || isNaN(pageLimit)) {
    res.status(400);
  } else {
    let rows = await db.Drops.findAll({
      offset: pageStart,
      limit: pageLimit,
      where: { visibility: 1 },
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "title", "description", "lang", "updatedAt"],
    });
    console.log("Rows from paginate are", rows);
    res.json(rows.map((row) => row.dataValues));
  }
});

// Retrieve all the comments for a drop if they exist.
router.get("/:dropId/comments", async (req, res) => {
  const dropId = req.params.dropId;
  const comments = await db.Comments.findAll({
    where: { dropId: dropId },
    attributes: ["id", "text", "updatedAt", "userId"],
  });

  if (comments !== null) {
    const filteredComments = comments.map(async (comment) => {
      const commentAuthor = await db.Users.findByPk(comment.dataValues.userId, {
        attributes: ["username"],
      });
      return { ...comment, username: commentAuthor.dataValues.username };
    });
    res.json(comments).status(200);
  } else {
    res.json({}).status(200);
  }
});

// Retrieve the contents of a single drop
router.get("/:dropId", async (req, res) => {
  //res.json("Hello from drops get");
  let dropId = req.params.dropId;
  let dropRecord = await db.Drops.findByPk(dropId, {
    attributes: ["id", "title", "lang", "visibility", "text", "description"],
  });

  console.log("Retrieve a record", dropRecord);
  if (dropRecord === null) {
    res.status(400).end();
  } else {
    let annotations = await db.DropAnnotations.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "dropId"],
      },
      where: {
        dropId: dropRecord.dataValues.id,
      },
    });
    console.log(
      "Annotations retrieve are",
      annotations.map((annotation) => annotation.dataValues)
    );

    const respObject = {
      codeDrop: dropRecord.dataValues,
      dropAnnotations: annotations.map((annotation) => annotation.dataValues),
    };
    res.json(respObject).status(200);
  }
});

// DELETE Routes

// Delete a comment
router.delete("/:dropId/comments/:cId", async (req, res) => {
  let dropId = req.params.dropId;
  let commentId = req.params.cId;

  if (user === undefined) {
    res.json({ msg: "Unauthorized" }).status(401);
    return;
  }
  let commentInstance = await db.Comments.findOne({
    where: { userId: user.uid, dropId: dropId, id: commentId },
  });
  // If the drop does not exist
  if (commentInstance === null) {
    res.status(404).end();
    return;
  }

  commentInstance.destroy();
  res.status(200).end();
});

// Remove a star
router.delete("/:dropId/stars", async (req, res) => {
  let dropId = req.params.dropId;

  if (user === undefined) {
    res.json({ msg: "Unauthorized" }).status(401);
    return;
  }
  let starInstance = await db.Stars.findOne({
    where: { userId: user.uid, dropId: dropId },
  });

  // If the drop does not exist
  if (starInstance === null) {
    res.status(404).end();
    return;
  }

  starInstance.destroy();
  res.status(200).end();
});

// Delete a single drop
router.delete("/:dropId", async (req, res) => {
  let dropId = req.params.dropId;
  let user = req.user;
  console.log("ID and user are", dropId, user);

  if (user === undefined) {
    res.json({ msg: "Unauthorized" }).status(401);
  } else {
    let drop = await db.Drops.findOne({
      where: { userId: user.uid, id: dropId },
    });
    // If the drop does not exist
    if (drop === null) {
      res.status(404).end();
      return;
    }

    drop.destroy();
    res.status(200).end();
  }
});

router.post("/drop/:dropId/comments", async (req, res) => {
  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  const commentBody = req.body.text || "";
  const dropId = req.params.dropId;
  if (commentBody.length === 0) {
    res.status(400).end();
    return;
  }
  let dropCount = await req.app.locals.db.Drops.count({
    where: { id: dropId },
  });
  if (dropCount === 0) {
    res.status(404).end();
    return;
  }
  // console.log("Counted", userCount);

  let commentModel = await req.app.locals.db.Comments.create({
    text: commentBody,
    dropId: dropId,
    userId: req.user.uid,
  });
  if (commentModel === null) {
    res.status(500).end();
    return;
  }

  res.json({ id: commentModel.dataValues.id }).status(200);
});

router.post("/drop/:dropId/stars", async (req, res) => {
  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  const dropId = req.params.dropId;

  let dropCount = await req.app.locals.db.Drops.count({
    where: { id: dropId },
  });
  if (dropCount === 0) {
    res.status(404).end();
    return;
  }

  let starModel = await req.app.locals.db.Stars.create({
    dropId: dropId,
    userId: req.user.uid,
  });
  if (commentModel === null) {
    res.status(500).end();
    return;
  }

  res.status(200).end();
});

router.post("/drop", async (req, res) => {
  let title = req.body.title;
  let lang = req.body.lang;
  let visibility = req.body.visibility;
  let textBody = req.body.text;
  let description = req.body.description || "";
  let annotations = req.body.annotations || [];

  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }

  console.log(
    "SERVER RECEIVED",
    title,
    lang,
    visibility,
    textBody,
    description,
    annotations
  );

  let dropRecordInfo = await req.app.locals.db.Drops.create({
    title: title,
    lang: lang,
    visibility: visibility,
    text: textBody,
    description: description,
    userId: req.user.uid,
  });
  // Todo: Handle insertion error

  annotations.forEach((annotation) => {
    req.app.locals.db.DropAnnotations.create({
      startLine: annotation.start,
      endLine: annotation.end,
      annotation_text: annotation.text,
      dropId: dropRecordInfo.dataValues.id,
      userId: req.user.uid,
    });
    // Todo: Handle insertion error
  });
  res.json({ id: dropRecordInfo.dataValues.id }).status(200);
});

router.put("/drops/:dropId", (req, res) => {
  let dropId = req.params.dropId;
});

module.exports = router;
