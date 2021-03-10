const helper = require("./helpers");

const search = async (req, res) => {
  // TODO: Use try/catch here to turn params into int in case it fails.
  if (
    !helper.isInt(req.query.start) ||
    !helper.isInt(req.query.count) ||
    req.query.contains === undefined
  ) {
    res.status(400).end();
    return;
  }

  const pageStart = parseInt(req.query.start || 0, 10);
  const pageLimit = parseInt(req.query.count || 15, 10);
  const timeWindow = req.query.t || "all_time";
  const searchField = req.query.field || "title";
  const searchTerm = req.query.contains || "";

  const now = new Date();
  const gteOp = req.app.locals.db.Sequelize.Op.gte;
  const containsOp = req.app.locals.db.Sequelize.Op.substring;
  const searchParams = {};
  let minDate;

  switch (timeWindow) {
    case "day":
      minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case "month":
      minDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      minDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "all_time":
      minDate = new Date(2020, 0, 1);
      break;
    default:
      res.status(400).end();
      return;
  }
  searchParams.updatedAt = { [gteOp]: minDate };

  switch (searchField) {
    case "title":
      searchParams.title = { [containsOp]: searchTerm };
      break;
    case "language":
      searchParams.lang = { [containsOp]: searchTerm };
      break;
    case "user":
      // This case is not handled here but instead in the join condition
      break;
    default:
      res.status(400).end();
      return;
  }

  try {
    let rows;
    if (req.user !== undefined) {
      // TODO: Handle adding private drops to the search if user is authenticated
      rows = await req.app.locals.db.Drops.findAll({
        offset: pageStart,
        limit: pageLimit,
        where: { visibility: 1, ...searchParams },
        order: [["updatedAt", "DESC"]],
        attributes: ["id", "title", "description", "lang", "updatedAt", "numForks"],
        include: [
          {
            model: req.app.locals.db.Stars,
            where: { userId: req.user.uid },
            required: false,
          },
          {
            model: req.app.locals.db.Users,
            attributes: ["id", "username"],
            where:
              searchField === "user"
                ? { username: { [containsOp]: searchTerm } }
                : {},
            required: searchField === "user",
          },
        ],
      });
    } else {
      rows = await req.app.locals.db.Drops.findAll({
        offset: pageStart,
        limit: pageLimit,
        where: { visibility: 1, ...searchParams },
        order: [["updatedAt", "DESC"]],
        attributes: ["id", "title", "description", "lang", "updatedAt", "numForks"],
        include: [
          {
            model: req.app.locals.db.Users,
            attributes: ["id", "username"],
            where:
              searchField === "user"
                ? { username: { [containsOp]: searchTerm } }
                : {},
            required: searchField === "user",
          },
        ],
      });
    }

    const response = await Promise.all(
      rows.map(async (row) => {
        if (req.user !== undefined) {
          const rowData = { ...row.dataValues };
          rowData.isStarred = row.dataValues.stars.length !== 0;
          delete rowData.stars;

          const starCount = await req.app.locals.db.Stars.count({
            where: { dropId: rowData.id },
          });
          rowData.starCount = starCount;
          return rowData;
        }
        const starCount = await req.app.locals.db.Stars.count({
          where: { dropId: row.dataValues.id },
        });
        return { ...row.dataValues, isStarred: false, starCount };
      })
    );

    res.status(200).json(response);
  } catch (err) {
    res.status(500).end();
  }
};

const paginate = async (req, res) => {
  if (!helper.isInt(req.query.start) || !helper.isInt(req.query.count)) {
    res.status(400).end();
    return;
  }
  const pageStart = parseInt(req.query.start || 0, 10);
  const pageLimit = parseInt(req.query.count || 15, 10);

  try {
    let rows;
    if (req.user !== undefined) {
      rows = await req.app.locals.db.Drops.findAll({
        offset: pageStart,
        limit: pageLimit,
        where: { visibility: 1 },
        order: [["updatedAt", "DESC"]],
        attributes: [
          "id",
          "title",
          "description",
          "numForks",
          "lang",
          "updatedAt",
        ],
        include: [
          {
            model: req.app.locals.db.Stars,
            where: { userId: req.user.uid },
            required: false,
          },
          {
            model: req.app.locals.db.Users,
            attributes: ["id", "username"],
            required: false,
          },
        ],
      });
    } else {
      rows = await req.app.locals.db.Drops.findAll({
        offset: pageStart,
        limit: pageLimit,
        where: { visibility: 1 },
        order: [["updatedAt", "DESC"]],
        attributes: [
          "id",
          "title",
          "description",
          "lang",
          "updatedAt",
          "numForks",
        ],
        include: [
          {
            model: req.app.locals.db.Users,
            attributes: ["id", "username"],
            required: false,
          },
        ],
      });
    }
    const response = await Promise.all(
      rows.map(async (row) => {
        if (req.user !== undefined) {
          const rowData = { ...row.dataValues };
          rowData.isStarred = row.dataValues.stars.length !== 0;
          delete rowData.stars;

          const starCount = await req.app.locals.db.Stars.count({
            where: { dropId: rowData.id },
          });
          rowData.starCount = starCount;
          return rowData;
        }
        const starCount = await req.app.locals.db.Stars.count({
          where: { dropId: row.dataValues.id },
        });
        return { ...row.dataValues, isStarred: false, starCount };
      })
    );

    res.status(200).json(response);
  } catch (err) {
    res.status(500).end();
  }
};

const getDrop = async (req, res) => {
  if (!helper.isInt(req.params.dropId)) {
    res.status(400).end();
    return;
  }

  const dropId = parseInt(req.params.dropId, 10);
  try {
    const dropInstance = await req.app.locals.db.Drops.findByPk(dropId, {
      attributes: [
        "id",
        "title",
        "lang",
        "visibility",
        "text",
        "description",
        "numForks",
        "userId",
        "isForked",
        "forkedFromId",
      ],
    });
    if (dropInstance === null) {
      res.status(404).end();
      return;
    }
    if (
      dropInstance.visibility === false &&
      (req.user === undefined ||
        req.user.uid !== dropInstance.dataValues.userId)
    ) {
      res.status(401).end();
      return;
    }

    const annotations = await req.app.locals.db.DropAnnotations.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "dropId"],
      },
      where: {
        dropId: dropInstance.dataValues.id,
      },
    });

    let isStarred = false;
    if (req.user !== undefined) {
      const hasStar = await req.app.locals.db.Stars.findOne({
        where: { dropId: dropInstance.dataValues.id, userId: req.user.uid },
      });
      if (hasStar !== null) {
        isStarred = true;
      }
    }

    const starCount = await req.app.locals.db.Stars.count({
      where: { dropId: dropInstance.dataValues.id },
    });

    if (dropInstance.dataValues.isForked === true) {
      const forkedFromDrop = await req.app.locals.db.Drops.findByPk(
        dropInstance.dataValues.forkedFromId,
        {
          attributes: ["title", "visibility"],
          include: [
            {
              model: req.app.locals.db.Users,
              attributes: ["id", "username"],
              required: false,
            },
          ],
        }
      );
      if (forkedFromDrop === null) {
        const respObject = {
          codeDrop: {
            ...dropInstance.dataValues,
            isStarred,
            starCount,
            forkData: null,
          },
          dropAnnotations: annotations.map(
            (annotation) => annotation.dataValues
          ),
        };
        res.json(respObject).status(200);
      } else if (forkedFromDrop.dataValues.visibility === false) {
        if (req.user.uid !== forkedFromDrop.dataValues.user.dataValues.id) {
          const respObject = {
            codeDrop: {
              ...dropInstance.dataValues,
              isStarred,
              starCount,
              forkData: null,
            },
            dropAnnotations: annotations.map(
              (annotation) => annotation.dataValues
            ),
          };
          res.json(respObject).status(200);
        } else {
          const respObject = {
            codeDrop: {
              ...dropInstance.dataValues,
              isStarred,
              starCount,
              forkData: {
                title: forkedFromDrop.dataValues.title,
                user: forkedFromDrop.dataValues.user.dataValues,
              },
            },
            dropAnnotations: annotations.map(
              (annotation) => annotation.dataValues
            ),
          };
          res.json(respObject).status(200);
        }
      } else {
        const respObject = {
          codeDrop: {
            ...dropInstance.dataValues,
            isStarred,
            starCount,
            forkData: {
              title: forkedFromDrop.dataValues.title,
              user: forkedFromDrop.dataValues.user.dataValues,
            },
          },
          dropAnnotations: annotations.map(
            (annotation) => annotation.dataValues
          ),
        };
        res.json(respObject).status(200);
      }
    } else {
      const respObject = {
        codeDrop: {
          ...dropInstance.dataValues,
          isStarred,
          starCount,
          forkData: null,
        },
        dropAnnotations: annotations.map((annotation) => annotation.dataValues),
      };
      res.json(respObject).status(200);
    }
  } catch (err) {
    res.status(500).end();
  }
};

const deleteDrop = async (req, res) => {
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  if (!helper.isInt(req.params.dropId)) {
    res.status(400).end();
    return;
  }
  const dropId = parseInt(req.params.dropId, 10);
  const currUser = req.user;

  try {
    const dropInstance = await req.app.locals.db.Drops.findOne({
      where: { userId: currUser.uid, id: dropId },
    });
    if (dropInstance === null) {
      res.status(404).end();
      return;
    }

    if (dropInstance.isForked === true && dropInstance.forkedFromId !== null) {
      const parentDropInstance = await req.app.locals.db.Drops.findByPk(
        dropInstance.forkedFromId
      );
      parentDropInstance.numForks -= 1;
      await parentDropInstance.save();

      const parentDropUserInstance = await req.app.locals.db.Users.findByPk(
        parentDropInstance.userId
      );
      parentDropUserInstance.numForks -= 1;
      parentDropUserInstance.save();
    }
    await dropInstance.destroy();
    res.status(200).end();
  } catch (error) {
    res.status(500).end();
  }
};

const createDrop = async (req, res) => {
  const { title } = req.body;
  const lang = req.body.lang || "None";
  const { visibility } = req.body;
  const textBody = req.body.text;
  const description = req.body.description || "";
  const annotations = req.body.annotations || [];
  const { isForked } = req.body;
  const forkedFrom = req.body.parentId;

  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  if (
    typeof title === "undefined" ||
    typeof textBody === "undefined" ||
    title.length === 0 ||
    textBody.length === 0
  ) {
    res.status(400).end();
    return;
  }

  try {
    let newDropRecordInstance;
    if (isForked !== undefined && (isForked === "true" || isForked === true)) {
      if (helper.isInt(forkedFrom)) {
        res.status(404).end();
        return;
      }
      const parentRecordInstance = await req.app.locals.db.Drops.findByPk(
        forkedFrom
      );
      if (
        parentRecordInstance === null ||
        (parentRecordInstance.visibility === false &&
          req.user.uid !== parentRecordInstance.userId)
      ) {
        res.status(404).end();
        return;
      }
      const parentUserInstance = await req.app.locals.db.Users.findByPk(
        parentRecordInstance.dataValues.userId
      );
      // Increment number of forks for the parent drop
      parentRecordInstance.numForks += 1;
      await parentRecordInstance.save();
      // Increment number of forks for the parent user
      parentUserInstance.numForks += 1;
      await parentUserInstance.save();

      newDropRecordInstance = await req.app.locals.db.Drops.create({
        title,
        lang,
        visibility,
        text: textBody,
        description,
        userId: req.user.uid,
        isForked: true,
        forkedFromId: parentRecordInstance.dataValues.id,
      });
    } else {
      newDropRecordInstance = await req.app.locals.db.Drops.create({
        title,
        lang,
        visibility,
        text: textBody,
        description,
        userId: req.user.uid,
        isForked: false,
        forkedFromId: null,
      });
    }

    annotations.forEach(async (annotation) => {
      await req.app.locals.db.DropAnnotations.create({
        startLine: annotation.start,
        endLine: annotation.end,
        annotation_text: annotation.text,
        dropId: newDropRecordInstance.dataValues.id,
        userId: req.user.uid,
      });
    });
    res.status(200).json({ id: newDropRecordInstance.dataValues.id });
  } catch (error) {
    res.status(500).end();
  }
};

const updateDrop = async (req, res) => {
  if (!helper.isInt(req.params.dropId)) {
    res.status(400).end();
    return;
  }
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  if (
    req.body.text === undefined ||
    req.body.length === 0 ||
    req.body.title === undefined ||
    req.body.title.length === 0
  ) {
    res.status(400).end();
    return;
  }

  const dropId = parseInt(req.params.dropId, 10);
  // const title = req.body.title;
  const { text, title } = req.body;
  const lang = req.body.lang || "None";
  const visibility = req.body.visibility || true;
  const description = req.body.description || "";
  const annotations = req.body.annotations || [];

  const newAnnotations = [];
  const updatedAnnotations = {};
  annotations.forEach((annotation) => {
    if (annotation.dbId !== undefined) {
      updatedAnnotations[annotation.dbId] = annotation;
    } else {
      newAnnotations.concat(annotation);
    }
  });

  try {
    // Retrieve the model of the drop that is being updated
    const dropRecordInstance = await req.app.locals.db.Drops.findOne({
      where: {
        id: dropId,
        userId: req.user.uid,
      },
    });
    if (dropRecordInstance === null) {
      res.status(404).end();
      return;
    }
    dropRecordInstance.title = title;
    dropRecordInstance.lang = lang;
    dropRecordInstance.visibility = visibility;
    dropRecordInstance.text = text;
    dropRecordInstance.description = description;
    await dropRecordInstance.save();

    const dropAnnotationInstances = await req.app.locals.db.DropAnnotations.findAll(
      {
        where: {
          dropId,
        },
        raw: false,
      }
    );

    // Iterating through the result set produced by FindAll using "for ... of..." does
    // not work for some reason. ForEach is used here instead.
    dropAnnotationInstances.forEach((annotationModel) => {
      if (annotationModel.dataValues.id in updatedAnnotations) {
        annotationModel.startLine =
          updatedAnnotations[annotationModel.id].start;
        annotationModel.endLine = updatedAnnotations[annotationModel.id].end;
        annotationModel.annotation_text =
          updatedAnnotations[annotationModel.id].text;
        annotationModel.save();
      } else {
        annotationModel.destroy();
      }
    });

    for (const newAnnotation in newAnnotations) {
      await req.app.locals.db.DropAnnotations.create({
        startLine: newAnnotation.start,
        endLine: newAnnotation.end,
        annotation_text: newAnnotation.text,
      });
    }
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
};

module.exports = {
  search,
  paginate,
  getDrop,
  deleteDrop,
  createDrop,
  updateDrop,
};
