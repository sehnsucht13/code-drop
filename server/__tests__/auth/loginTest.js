const { db, app } = require("../../expressSetup");
const supertest = require("supertest");

describe("Registration tests", () => {
  let agent;
  beforeAll(async (done) => {
    const dbStatus = await db.sequelize.sync();
    agent = supertest.agent(app);

    done();
  });

  afterAll(async (done) => {
    await db.sequelize.close();
    done();
  });

  it("Should login successfully", async (done) => {
    const resp = await agent
      .post("/auth/login/")
      .send({ username: "testUser1", password: "testUser1" });

    expect(resp.statusCode).toBe(200);
    done();
  });

  it("Should deny login wrong password", async (done) => {
    const resp = await agent
      .post("/auth/login/")
      .send({ username: "testUser1", password: "WRONG" });

    expect(resp.statusCode).toBe(401);
    done();
  });

  it("Should deny login non-existant user", async (done) => {
    const resp = await agent
      .post("/auth/login/")
      .send({ username: "MISSING_USER", password: "WRONG" });

    expect(resp.statusCode).toBe(401);
    done();
  });
});
