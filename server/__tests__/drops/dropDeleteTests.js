const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Drop Create", () => {
  const u1 = {
    username: "delete_drop_user_u1",
    password: "delete_drop_user_u1",
  };
  const u2 = {
    username: "delete_drop_user_u2",
    password: "delete_drop_user_u2",
  };
  const u3 = {
    username: "delete_drop_user_u3",
    password: "delete_drop_user_u3",
  };

  beforeAll(async (done) => {
    await db.sequelize.sync();
    const u1_pass = await bcrypt.hash(u1.password, 10);
    const u2_pass = await bcrypt.hash(u2.password, 10);
    const u3_pass = await bcrypt.hash(u3.password, 10);
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
    const u1_dropModel = await db.Drops.findOne({
      where: { userId: u1_model.id },
    });
    const u2_dropModel = await db.Drops.findOne({
      where: { userId: u2_model.id },
    });
    const u3_dropModel = await db.Drops.findOne({
      where: { userId: u3_model.id },
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
    if (u1_dropModel !== null) {
      await u1_dropModel.destroy();
    }
    if (u2_dropModel !== null) {
      await u2_dropModel.destroy();
    }
    if (u3_dropModel !== null) {
      await u3_dropModel.destroy();
    }

    await db.sequelize.close();
    done();
  });

  it("return 401 if not logged in", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.delete("/drop/423");
    expect(resp.statusCode).toBe(401);
    done();
  });
  it("should return 400 if drop id is not a number while user logged in", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: u1.username, password: u1.password });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const resp = await agent.delete("/drop/asf");
    expect(resp.statusCode).toBe(400);

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });
  it("should return 404 if user logged in and drop does not exist", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: u2.username, password: u2.password });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const resp = await agent.delete("/drop/12345678888");
    expect(resp.statusCode).toBe(404);

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should delete existing drop if user logged in", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: u3.username, password: u3.password });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const newDrop = await db.Drops.create({
      title: "Deleted drop",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      description: "Description",
      userId: sessionResp.body.uid,
    });
    const newDropId = newDrop.dataValues.id;
    const resp = await agent.delete(`/drop/${newDropId}`);
    expect(resp.statusCode).toBe(200);

    const deletedDrop = await db.Drops.findByPk(newDropId);
    if (deletedDrop !== null) {
      done.fail(new Error("New Drop was not deleted!"));
    }

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });
});
