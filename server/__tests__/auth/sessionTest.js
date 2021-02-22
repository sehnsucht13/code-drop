const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Registration tests", () => {
  const users = [
    { username: "register_user_1", password: "register_user_1" },
    { username: "register_user_2", password: "register_user_2" },
  ];
  let user_ids = [];
  beforeAll(async (done) => {
    const dbStatus = await db.sequelize.sync();
    await db.sequelize.sync();
    for (const user of users) {
      const upass = await bcrypt.hash(user.password, 10);
      let newUser = await db.Users.create({
        username: user.username,
        password: upass,
        description: "",
        numStars: 0,
        numForks: 0,
      });
      user_ids.push(newUser.dataValues.id);
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

  it("Should return session info successfully", async (done) => {
    let agent = supertest.agent(app);
    const login = await agent.post("/auth/login/").send({ ...users[0] });
    expect(login.statusCode).toBe(200);

    const session = await agent.get("/auth/session/");

    expect(session.statusCode).toBe(200);
    expect(session.body).toEqual({
      username: users[0].username,
      uid: user_ids[0],
    });
    done();
  });

  it("Test session info with bad login", async (done) => {
    let agent = supertest.agent(app);
    const login = await agent
      .post("/auth/login/")
      .send({ username: users[0].username, password: "WRONG" });
    expect(login.statusCode).toBe(401);

    const session = await agent.get("/auth/session/");

    expect(session.statusCode).toBe(200);
    expect(session.body).toEqual({});
    done();
  });

  it("Test session info after logout", async (done) => {
    let agent = supertest.agent(app);
    const login = await agent.post("/auth/login/").send({ ...users[1] });
    expect(login.statusCode).toBe(200);

    const sessionBeforLogout = await agent.get("/auth/session/");
    expect(sessionBeforLogout.statusCode).toBe(200);
    expect(sessionBeforLogout.body).toEqual({
      username: users[1].username,
      uid: user_ids[1],
    });

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);

    const sessionLogin = await agent.get("/auth/session/");

    expect(sessionLogin.statusCode).toBe(200);
    expect(sessionLogin.body).toEqual({});
    done();
  });
});
