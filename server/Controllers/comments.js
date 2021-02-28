const { isInt } = require("./helpers");

const getComments = async (req, res) => {
  if (!isInt(req.params.dropId)) {
    res.status(400).end();
    return;
  }
  const dropId = parseInt(req.params.dropId);

  try {
    const comments = await req.app.locals.db.Comments.findAll({
      where: { dropId: dropId },
      attributes: ["id", "text", "updatedAt"],
      include: [
        {
          model: req.app.locals.db.Users,
          attributes: ["id", "username"],
          required: false,
        },
      ],
    });

    if (comments !== null) {
      const filteredComments = comments.map((comment) => {
        return { ...comment.dataValues, user: { ...comment.user.dataValues } };
      });
      res.status(200).json(filteredComments);
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    res.status(500).end();
  }
};

const deleteComment = async (req, res) => {
  if (!isInt(req.params.dropId) || isInt(req.params.cId)) {
    res.status(400).end();
    return;
  } else if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  const dropId = parseInt(req.params.dropId);
  const commentId = parseInt(req.params.cId);

  const commentInstance = await req.app.locals.db.Comments.findOne({
    where: { userId: req.user.uid, dropId: dropId, id: commentId },
  });
  // If the drop does not exist
  if (commentInstance === null) {
    res.status(404).end();
    return;
  } else {
    await commentInstance.destroy();
    res.status(200).end();
  }
};

const createComment = async (req, res) => {
  if (!isInt(req.params.dropId) || req.body.text.length === 0) {
    res.status(400).end();
    return;
  } else if (req.user === undefined) {
    res.status(401).end();
    return;
  }

  const commentBody = req.body.text;
  const dropId = parseInt(req.params.dropId);

  try {
    const dropCount = await req.app.locals.db.Drops.count({
      where: { id: dropId },
    });

    // Drop does not exist
    if (dropCount === 0) {
      res.status(404).end();
      return;
    }

    const newCommentInstance = await req.app.locals.db.Comments.create({
      text: commentBody,
      dropId: dropId,
      userId: req.user.uid,
    });
    if (newCommentInstance === null) {
      res.status(500).end();
      return;
    }
    res.status(200).json({ id: newCommentInstance.dataValues.id });
  } catch (err) {
    res.status(500).end();
  }
};

const updateComment = async (req, res) => {
  if (
    !isInt(req.params.dropId) ||
    !isInt(req.params.commentId) ||
    typeof commentBody !== "string" ||
    commentBody.length == 0
  ) {
    res.status(400).end();
    return;
  } else if (req.user === undefined) {
    res.status(401).end();
    return;
  }

  const dropId = parseInt(req.params.dropId);
  const commentId = parseInt(req.params.commentId);
  const commentBody = req.body.text;

  try {
    const commentInstance = await req.app.locals.db.Comments.findByPk(
      commentId
    );
    if (commentInstance === null) {
      res.status(404).end();
      return;
    } else if (req.user.uid !== commentInstance.userId) {
      res.status(401).end();
      return;
    }
    commentInstance.text = commentBody;
    await commentInstance.save();
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

module.exports = {
  getComments,
  deleteComment,
  createComment,
  updateComment,
};
