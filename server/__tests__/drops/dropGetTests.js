const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Drop Get", () => {
  const users = [
    { username: "get_drop_u1", password: "get_drop_u1" },
    { username: "get_drop_u2", password: "get_drop_u2" },
    { username: "get_drop_u3", password: "get_drop_u3" },
  ];

  beforeAll(async (done) => {
    await db.sequelize.sync();
    for (const user of users) {
      const upass = await bcrypt.hash(user.password, 10);
      await db.Users.create({
        username: user.username,
        password: upass,
        description: "",
        numStars: 0,
        numForks: 0,
      });
    }
    done();
  });

  afterAll(async (done) => {
    for (const user of users) {
      const userModel = await db.Users.findOne({
        where: { username: user.username },
      });
      const userDropModel = await db.Drops.findOne({
        where: { userId: userModel.id },
      });

      if (userModel !== null) {
        await userModel.destroy();
      }
      if (userDropModel !== null) {
        await userDropModel.destroy();
      }
    }
    await db.sequelize.close();
    done();
  });

  it.todo("should return 200 and all information for a drop with annotations");

  it("should return 200 and all data for a drop that is not forked", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[0] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const dropData = {
      title: "New drop for get test",
      description: "description",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      annotations: [],
      userId: sessionResp.body.uid,
    };
    const newDropModel = await db.Drops.create(dropData);
    const resp = await agent.get(`/api/drop/${newDropModel.dataValues.id}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      codeDrop: {
        id: newDropModel.dataValues.id,
        userId: sessionResp.body.uid,
        title: "New drop for get test",
        description: "description",
        lang: "python",
        visibility: true,
        text: "# Hello world",
        forkedFromId: null,
        forkData: null,
        numForks: 0,
        isForked: false,
        isStarred: false,
        starCount: 0,
      },
      dropAnnotations: [],
    });
    done();
  });

  it("should return 200 and all data for a private drop forked from another private drop created by the current user", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[2] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const parentDropData = {
      title: "New private drop that is not forked",
      description: "",
      lang: "python",
      visibility: false,
      text: "# Hello world",
      annotations: [],
      userId: sessionResp.body.uid,
      isForked: false,
      forkedFromId: null,
    };
    const parentDropModel = await db.Drops.create(parentDropData);

    const forkedDropData = {
      title: "New private drop that is forked",
      description: "",
      lang: "python",
      visibility: false,
      text: "# Hello world",
      annotations: [],
      userId: sessionResp.body.uid,
      isForked: true,
      forkedFromId: parentDropModel.id,
    };
    const forkedDropModel = await db.Drops.create(forkedDropData);

    const resp = await agent.get(`/api/drop/${forkedDropModel.dataValues.id}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      codeDrop: {
        id: forkedDropModel.dataValues.id,
        userId: sessionResp.body.uid,
        title: "New private drop that is forked",
        description: "",
        lang: "python",
        visibility: false,
        text: "# Hello world",
        isForked: true,
        numForks: 0,
        isStarred: false,
        starCount: 0,
        forkedFromId: parentDropModel.id,
        forkData: {
          title: parentDropData.title,
          user: {
            id: sessionResp.body.uid,
            username: sessionResp.body.username,
          },
        },
      },
      dropAnnotations: [],
    });
    done();
  });

  it("should return 200 and all data for a public drop forked from another public drop", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[1] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const parentDropData = {
      title: "New drop that is not forked",
      description: "",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      annotations: [],
      userId: sessionResp.body.uid,
      isForked: false,
      forkedFromId: null,
    };
    const parentDropModel = await db.Drops.create(parentDropData);

    const forkedDropData = {
      title: "New drop that is forked",
      description: "",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      annotations: [],
      userId: sessionResp.body.uid,
      isForked: true,
      forkedFromId: parentDropModel.id,
    };
    const forkedDropModel = await db.Drops.create(forkedDropData);

    const resp = await agent.get(`/api/drop/${forkedDropModel.dataValues.id}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      codeDrop: {
        id: forkedDropModel.dataValues.id,
        userId: sessionResp.body.uid,
        title: "New drop that is forked",
        description: "",
        lang: "python",
        visibility: true,
        text: "# Hello world",
        isForked: true,
        numForks: 0,
        isStarred: false,
        starCount: 0,
        forkedFromId: parentDropModel.id,
        forkData: {
          title: parentDropData.title,
          user: {
            id: sessionResp.body.uid,
            username: sessionResp.body.username,
          },
        },
      },
      dropAnnotations: [],
    });
    done();
  });

  it("should return 400 if drop id is not a number", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.get("/api/drop/ab323a");
    expect(resp.statusCode).toBe(400);
    done();
  });
  it("should return 404 if drop does not exist", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.get("/api/drop/88888888");
    expect(resp.statusCode).toBe(404);
    done();
  });
});
