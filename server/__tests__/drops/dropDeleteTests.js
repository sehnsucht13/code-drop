const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Drop Create", () => {
  const users = [
    { username: "delete_drop_user_u1", password: "delete_drop_user_u1" },
    { username: "delete_drop_user_u2", password: "delete_drop_user_u2" },
    { username: "delete_drop_user_u3", password: "delete_drop_user_u3" },
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

  it("return 401 if not logged in", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.delete("/api/drop/423");
    expect(resp.statusCode).toBe(401);
    done();
  });
  it("should return 400 if drop id is not a number while user logged in", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[0] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const resp = await agent.delete("/api/drop/asf");
    expect(resp.statusCode).toBe(400);

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });
  it("should return 404 if user logged in and drop does not exist", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[1] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const resp = await agent.delete("/api/drop/12345678888");
    expect(resp.statusCode).toBe(404);

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });

  it("should delete existing drop if user logged in", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/api/auth/login/")
      .send({ ...users[2] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
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
    const resp = await agent.delete(`/api/drop/${newDropId}`);
    expect(resp.statusCode).toBe(200);

    const deletedDrop = await db.Drops.findByPk(newDropId);
    if (deletedDrop !== null) {
      done.fail(new Error("New Drop was not deleted!"));
    }

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });
});
