const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Logout tests", () => {
  const users = [{ username: "logout_user_1", password: "logout_user_1" }];
  let user_ids = [];
  beforeAll(async (done) => {
    await db.sequelize.sync();
    for (const user of users) {
      const upass = await bcrypt.hash(user.password, 10);
      const userModel = await db.Users.create({
        username: user.username,
        password: upass,
        description: "",
        numStars: 0,
        numForks: 0,
      });
      user_ids.push(userModel.dataValues.id);
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

  it("Logout successfully", async (done) => {
    let agent = supertest.agent(app);
    const login = await agent.post("/auth/login/").send({ ...users[0] });
    expect(login.statusCode).toBe(200);

    const sessionBeforLogout = await agent.get("/auth/session/");
    expect(sessionBeforLogout.statusCode).toBe(200);
    expect(sessionBeforLogout.body).toEqual({
      username: users[0].username,
      uid: user_ids[0],
    });

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);

    const sessionLogin = await agent.get("/auth/session/");

    expect(sessionLogin.statusCode).toBe(200);
    expect(sessionLogin.body).toEqual({});
    done();
  });

  it("Should not throw error if user not logged in", async (done) => {
    let agent = supertest.agent(app);

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
    done();
  });
});
