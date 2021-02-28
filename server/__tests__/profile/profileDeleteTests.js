const { db, app } = require("../../expressSetup");
const supertest = require("supertest");

describe("Profile Delete Tests", () => {
  let sessionId_1;
  let sessionId_2;
  let dropIds = [];
  beforeAll(async (done) => {
    const dbStatus = await db.sequelize.sync();
    // Create user one
    const agent = supertest.agent(app);

    const registerResp = await agent.post("/api/auth/register/").send({
      username: "tdp_1",
      password: "tdp_1",
    });
    expect(registerResp.statusCode).toBe(200);

    const loginResp = await agent.post("/api/auth/login/").send({
      username: "tdp_1",
      password: "tdp_1",
    });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/api/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    sessionId_1 = sessionResp.body;

    const logout = await agent.get("/api/auth/logout/");
    expect(logout.statusCode).toBe(200);

    // Create user two
    const agent_2 = supertest.agent(app);

    const registerResp_2 = await agent_2.post("/api/auth/register/").send({
      username: "tdp_2",
      password: "tdp_2",
    });
    expect(registerResp_2.statusCode).toBe(200);

    const loginResp_2 = await agent_2.post("/api/auth/login/").send({
      username: "tdp_2",
      password: "tdp_2",
    });
    expect(loginResp_2.statusCode).toBe(200);

    const sessionResp_2 = await agent_2.get("/api/auth/session/");
    expect(sessionResp_2.statusCode).toBe(200);
    sessionId_2 = sessionResp_2.body;

    const logout_2 = await agent_2.get("/api/auth/logout/");
    expect(logout_2.statusCode).toBe(200);

    // Create drops for user one
    const drop1 = await db.Drops.create({
      title: "public drop for delete user",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      description: "Test Description",
      userId: sessionResp.body.uid,
    });
    dropIds.push(drop1.dataValues.id);

    const drop2 = await db.Drops.create({
      title: "hidden drop for delete user",
      lang: "python",
      visibility: false,
      text: "# Hello world 2",
      description: "Test Description 2",
      userId: sessionResp.body.uid,
    });
    dropIds.push(drop2.dataValues.id);

    const drop3 = await db.Drops.create({
      title: "public drop for delete user 2",
      lang: "c++",
      visibility: true,
      text: "# Hello world 3",
      description: "Test Description 3",
      userId: sessionResp.body.uid,
    });
    dropIds.push(drop3.dataValues.id);

    done();
  });

  afterAll(async (done) => {
    for (const dropId of dropIds) {
      const dropModel = await db.Drops.findOne({ where: { id: dropId } });
      if (dropModel !== null) {
        await dropModel.destroy();
      }
    }

    const userModel_1 = await db.Users.findOne({
      where: { username: "tdp_1" },
    });

    if (userModel_1 !== null) {
      await userModel_1.destroy();
    }
    const userModel_2 = await db.Users.findOne({
      where: { username: "tdp_2" },
    });

    if (userModel_2 !== null) {
      await userModel_2.destroy();
    }

    await db.sequelize.close();
    done();
  });

  it("should not delete profile of a user while not logged in", async (done) => {
    const agent = supertest.agent(app);
    const deleteResp = await agent.delete(`/api/user/${sessionId_1.uid}`);
    expect(deleteResp.statusCode).toBe(401);

    done();
  });
  it("should not delete profile of another user while logged in", async (done) => {
    const agent = supertest.agent(app);
    const agent_2 = supertest.agent(app);

    const loginResp_2 = await agent_2.post("/api/auth/login/").send({
      username: "tdp_2",
      password: "tdp_2",
    });
    expect(loginResp_2.statusCode).toBe(200);

    const sessionResp_2 = await agent_2.get("/api/auth/session/");
    expect(sessionResp_2.statusCode).toBe(200);
    expect(sessionResp_2.body).toEqual(sessionId_2);

    const deleteResp = await agent.delete(`/api/user/${sessionId_1.uid}`);
    expect(deleteResp.statusCode).toBe(401);
    expect(deleteResp.body).toEqual({});

    const logout_2 = await agent_2.get("/api/auth/logout/");
    expect(logout_2.statusCode).toBe(200);

    done();
  });
  it("should delete profile of logged in user without drops and log them out", async (done) => {
    const agent_2 = supertest.agent(app);

    const loginResp_2 = await agent_2.post("/api/auth/login/").send({
      username: "tdp_2",
      password: "tdp_2",
    });
    expect(loginResp_2.statusCode).toBe(200);

    const sessionResp_1 = await agent_2.get("/api/auth/session/");
    expect(sessionResp_1.statusCode).toBe(200);
    expect(sessionResp_1.body).toEqual(sessionId_2);

    const deleteResp = await agent_2.delete(
      `/api/user/${sessionResp_1.body.uid}`
    );
    expect(deleteResp.statusCode).toBe(200);
    expect(deleteResp.body).toEqual({});

    const userModel = await db.Users.findOne({
      where: { id: sessionResp_1.body.uid },
    });
    expect(userModel).toBe(null);

    const sessionResp_2 = await agent_2.get("/api/auth/session/");
    expect(sessionResp_2.statusCode).toBe(200);
    expect(sessionResp_2.body).toEqual({});
    done();
  });
  // TODO: Finish this test!
  // it("should delete profile of logged in user with drops and log them out", async (done) => {
  // const agent_2 = supertest.agent(app);

  // const loginResp_2 = await agent_2.post("/api/auth/login/").send({
  //   username: "tdp_1",
  //   password: "tdp_1",
  // });
  // expect(loginResp_2.statusCode).toBe(200);

  // const sessionResp_1 = await agent_2.get("/api/auth/session/");
  // expect(sessionResp_1.statusCode).toBe(200);
  // expect(sessionResp_1.body).toEqual(sessionId_2);

  // const deleteResp = await agent_2.delete(`/api/user/${sessionResp_1.body.uid}`);
  // expect(deleteResp.statusCode).toBe(200);
  // expect(deleteResp.body).toEqual({});

  // const userModel = await db.Users.findOne({
  //   where: { id: sessionResp_1.body.uid },
  // });
  // expect(userModel).toBe(null);

  // const sessionResp_2 = await agent_2.get("/api/auth/session/");
  // expect(sessionResp_2.statusCode).toBe(200);
  // expect(sessionResp_2.body).toEqual({});
  // done();
  // });
});
