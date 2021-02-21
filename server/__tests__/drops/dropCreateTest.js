const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Drop Create", () => {
  const u1 = { username: "create_drop_u1", password: "create_drop_u1" };
  const u2 = { username: "create_drop_u2", password: "create_drop_u2" };
  const u3 = { username: "create_drop_u3", password: "create_drop_u3" };
  const u4 = { username: "create_drop_u4", password: "create_drop_u4" };

  beforeAll(async (done) => {
    await db.sequelize.sync();
    const u1_pass = await bcrypt.hash(u1.password, 10);
    const u2_pass = await bcrypt.hash(u2.password, 10);
    const u3_pass = await bcrypt.hash(u3.password, 10);
    const u4_pass = await bcrypt.hash(u4.password, 10);
    await db.Users.create({
      username: u1.username,
      password: u1_pass,
      description: "",
      numStars: 0,
      numForks: 0,
    });

    await db.Users.create({
      username: u2.username,
      password: u2_pass,
      description: "",
      numStars: 0,
      numForks: 0,
    });
    await db.Users.create({
      username: u3.username,
      password: u3_pass,
      description: "",
      numStars: 0,
      numForks: 0,
    });
    await db.Users.create({
      username: u4.username,
      password: u4_pass,
      description: "",
      numStars: 0,
      numForks: 0,
    });
    done();
  });

  afterAll(async (done) => {
    const u1_model = await db.Users.findOne({
      where: { username: u1.username },
    });
    const u2_model = await db.Users.findOne({
      where: { username: u2.username },
    });
    const u3_model = await db.Users.findOne({
      where: { username: u3.username },
    });
    const u4_model = await db.Users.findOne({
      where: { username: u4.username },
    });
    const u1_dropModel = await db.Drops.findOne({
      where: { userId: u1_model.id },
    });
    const u2_dropModel = await db.Drops.findOne({
      where: { userId: u2_model.id },
    });
    const u3_dropModel = await db.Drops.findOne({
      where: { userId: u3_model.id },
    });
    const u4_dropModel = await db.Drops.findOne({
      where: { userId: u4_model.id },
    });
    if (u1_model !== null) {
      await u1_model.destroy();
    }
    if (u2_model !== null) {
      await u2_model.destroy();
    }
    if (u3_model !== null) {
      await u3_model.destroy();
    }
    if (u4_model !== null) {
      await u4_model.destroy();
    }
    if (u1_dropModel !== null) {
      await u1_dropModel.destroy();
    }
    if (u2_dropModel !== null) {
      await u2_dropModel.destroy();
    }
    if (u3_dropModel !== null) {
      await u3_dropModel.destroy();
    }
    if (u4_dropModel !== null) {
      await u4_dropModel.destroy();
    }
    done();
  });

  it("rejects drop creation if not logged in", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.post("/drop").send({
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
      .post("/auth/login/")
      .send({ username: u1.username, password: u1.password });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/drop").send({
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
      const logout = await agent.get("/auth/logout/");
      expect(logout.statusCode).toBe(200);
      throw "New Drop model was not created.";
      done();
    }

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should reject drop missing a title", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: u2.username, password: u2.password });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/drop").send({
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
      const logout = await agent.get("/auth/logout/");
      expect(logout.statusCode).toBe(200);
      done();
      throw "New Drop without title was created.";
    }

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should reject drop with missing body", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: u3.username, password: u3.password });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/drop").send({
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
      const logout = await agent.get("/auth/logout/");
      expect(logout.statusCode).toBe(200);
      throw "New Drop without body was created.";
      done();
    }

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should reject drop with missing body and title", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: u4.username, password: u4.password });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});

    const resp = await agent.post("/drop").send({
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
      const logout = await agent.get("/auth/logout/");
      expect(logout.statusCode).toBe(200);
      throw "New Drop without body or title was created.";
      done();
    }

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });
});
