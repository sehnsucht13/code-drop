const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Login tests", () => {
  const users = [{ username: "login_user_1", password: "login_user_1" }];
  beforeAll(async (done) => {
    const dbStatus = await db.sequelize.sync();
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

  it("Should login successfully", async (done) => {
    const agent = supertest.agent(app);
    const resp = await agent.post("/auth/login/").send({ ...users[0] });

    expect(resp.statusCode).toBe(200);
    done();
  });

  it("Should deny login wrong password", async (done) => {
    const agent = supertest.agent(app);
    const resp = await agent
      .post("/auth/login/")
      .send({ username: users[0].username, password: "WRONG" });

    expect(resp.statusCode).toBe(401);
    done();
  });

  it("Should deny login non-existant user", async (done) => {
    const agent = supertest.agent(app);
    const resp = await agent
      .post("/auth/login/")
      .send({ username: "MISSING_USER", password: "WRONG" });

    expect(resp.statusCode).toBe(401);
    done();
  });
});
