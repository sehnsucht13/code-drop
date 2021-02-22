const { db, app } = require("../../expressSetup");
const supertest = require("supertest");

describe("Profile Tests", () => {
  let sessionId;
  let dropIds = [];
  beforeAll(async (done) => {
    const dbStatus = await db.sequelize.sync();
    const agent = supertest.agent(app);

    const registerResp = await agent
      .post("/auth/register/")
      .send({ username: "test_profile", password: "test_profile" });
    expect(registerResp.statusCode).toBe(200);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: "test_profile", password: "test_profile" });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    sessionId = sessionResp.body;

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);

    const drop1 = await db.Drops.create({
      title: "public drop 1",
      lang: "python",
      visibility: true,
      text: "# Hello world",
      description: "Test Description",
      userId: sessionResp.body.uid,
    });
    dropIds.push(drop1.dataValues.id);

    const drop2 = await db.Drops.create({
      title: "hidden drop",
      lang: "python",
      visibility: false,
      text: "# Hello world 2",
      description: "Test Description 2",
      userId: sessionResp.body.uid,
    });
    dropIds.push(drop2.dataValues.id);

    const drop3 = await db.Drops.create({
      title: "public drop 2",
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
    const userModel = await db.Users.findOne({
      where: { username: "test_profile" },
    });

    if (userModel !== null) {
      await userModel.destroy();
    }

    await db.sequelize.close();
    done();
  });

  it("Find current user's profile while authenticated", async () => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: "test_profile", password: "test_profile" });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    console.log("SERVER SESSION", sessionResp.body);

    const userResp = await agent.get(`/user/${sessionId.uid}/profile`);
    expect(userResp.statusCode).toBe(200);
    console.log("Server response!", userResp.body);

    expect(userResp.body).toEqual({
      profile: {
        id: sessionId.uid,
        username: "test_profile",
        description: "",
        numStars: 0,
        numForks: 0,
      },
      drops: [
        { id: dropIds[0], title: "public drop 1", lang: "python" },
        { id: dropIds[1], title: "hidden drop", lang: "python" },
        { id: dropIds[2], title: "public drop 2", lang: "c++" },
      ],
      counts: [
        { count: 1, lang: "c++" },
        { count: 2, lang: "python" },
      ],
    });

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
  });

  //   it("Find another user's profile while authenticated", async () => {
  //     let userResp = await agent.get("/user/523/profile");
  //     expect(userResp.statusCode).toBe(200);
  //   });

  it("Find existing user's profile while not authenticated", async () => {
    let agent = supertest.agent(app);
    let userResp = await agent.get(`/user/${sessionId.uid}/profile`);
    expect(userResp.statusCode).toBe(200);
    // console.log(userResp.body);
    expect(userResp.body).toEqual({
      profile: {
        id: sessionId.uid,
        username: "test_profile",
        description: "",
        numStars: 0,
        numForks: 0,
      },
      drops: [
        { id: dropIds[0], title: "public drop 1", lang: "python" },
        { id: dropIds[2], title: "public drop 2", lang: "c++" },
      ],
      counts: [
        { count: 1, lang: "c++" },
        { count: 1, lang: "python" },
      ],
    });
  });

  it("Find nonexistant profile while not authenticated", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent
      .post("/auth/login/")
      .send({ username: "test_profile", password: "test_profile" });
    expect(loginResp.statusCode).toBe(200);

    let userProfileResp = await agent.get("/user/523/profile");
    expect(userProfileResp.statusCode).toBe(404);

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);

    done();
  });

  it("Find nonexistant profile while authenticated", async (done) => {
    let agent = supertest.agent(app);

    let userProfileResp = await agent.get("/user/523/profile");
    expect(userProfileResp.statusCode).toBe(404);

    done();
  });
});
