const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Drop Get", () => {
  const users = [{ username: "get_drop_u1", password: "get_drop_u1" }];

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

  it("should return drop data for a drop without annotation", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent.post("/auth/login/").send({ ...users[0] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
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
    const resp = await agent.get(`/drop/${newDropModel.dataValues.id}`);
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
      },
      dropAnnotations: [],
    });
    done();
  });

  it("should return 400 if drop id is not a number", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.get("/drop/ab323a");
    expect(resp.statusCode).toBe(400);
    done();
  });
  it("should return 404 if drop does not exist", async (done) => {
    let agent = supertest.agent(app);
    const resp = await agent.get("/drop/88888888");
    expect(resp.statusCode).toBe(404);
    done();
  });
});
