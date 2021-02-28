const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Drop Create", () => {
  const users = [
    { username: "create_drop_u1", password: "create_drop_u1" },
    { username: "create_drop_u2", password: "create_drop_u2" },
    { username: "create_drop_u3", password: "create_drop_u3" },
    { username: "create_drop_u4", password: "create_drop_u4" },
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

  it("rejects drop creation if not logged in", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.post("/api/drop").send({
      title: "Hello",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      description: "Description",
      annotations: [],
    });
    expect(resp.statusCode).toBe(401);
    done();
  });

  it("should create drop when logged in", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[0] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/api/drop").send({
      title: "new_create_drop_u1",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      description: "Description",
      annotations: [],
    });
    expect(resp.statusCode).toBe(200);

    const newDropModel = await db.Drops.findOne({
      where: { title: "new_create_drop_u1" },
    });

    if (newDropModel === null) {
      const logout = await agent.get("/api/auth/logout/");
      expect(logout.statusCode).toBe(200);
      done.fail(new Error("New Drop model was not created."));
    }

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should reject drop missing a title", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[1] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/api/drop").send({
      title: "",
      lang: "python",
      visibility: true,
      text: "missing title body",
      description: "Description",
      annotations: [],
    });
    expect(resp.statusCode).toBe(400);

    const newDropModel = await db.Drops.findOne({
      where: { text: "missing title body" },
    });
    if (newDropModel !== null) {
      const logout = await agent.get("/api/auth/logout/");
      expect(logout.statusCode).toBe(200);
      done.fail(new Error("New Drop without title was created."));
    }

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should reject drop with missing body", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[2] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/api/drop").send({
      title: "drop_with_missing_body",
      lang: "python",
      visibility: true,
      text: "",
      description: "Description",
      annotations: [],
    });
    expect(resp.statusCode).toBe(400);

    const newDropModel = await db.Drops.findOne({
      where: { title: "drop_with_missing_body" },
    });
    if (newDropModel !== null) {
      const logout = await agent.get("/api/auth/logout/");
      expect(logout.statusCode).toBe(200);
      done.fail(new Error("New Drop without body was created."));
    }

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should reject drop with missing body and title", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[3] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/api/drop").send({
      title: "",
      lang: "python",
      visibility: true,
      text: "",
      description: "drop_with_missing_title",
      annotations: [],
    });
    expect(resp.statusCode).toBe(400);

    const newDropModel = await db.Drops.findOne({
      where: { userId: sessionResp.body.uid },
    });
    if (newDropModel !== null) {
      const logout = await agent.get("/api/auth/logout/");
      expect(logout.statusCode).toBe(200);

      done.fail(new Error("New Drop without body or title was created."));
    }

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });
});
