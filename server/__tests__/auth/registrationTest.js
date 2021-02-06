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
    const test1User = await db.Users.findOne({ where: { username: "test1" } });
    if (test1User !== null) {
      await test1User.destroy();
    }

    const takenUser = await db.Users.findOne({ where: { username: "taken" } });
    if (takenUser !== null) {
      await takenUser.destroy();
    }
    await db.sequelize.close();
    done();
  });

  it("tests valid registration", async (done) => {
    const resp = await agent
      .post("/auth/register/")
      .send({ username: "test1", password: "test1" });

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ status: "OK" });
    done();
  });

  it("tests registering taken name", async (done) => {
    await agent.post("/auth/register").send({
      username: "taken",
      password: "taken",
    });

    const resp = await agent
      .post("/auth/register/")
      .send({ username: "taken", password: "taken" });

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ status: "TAKEN" });
    done();
  });

  it("tests registering with missing username", async (done) => {
    const resp = await agent
      .post("/auth/register/")
      .send({ password: "testUser1" });

    expect(resp.statusCode).toBe(401);
    expect(resp.body).toEqual({ msg: "Password or Username are not provided" });
    done();
  });

  it("tests registering with missing password", async (done) => {
    const resp = await agent
      .post("/auth/register/")
      .send({ username: "testUser1" });

    expect(resp.statusCode).toBe(401);
    expect(resp.body).toEqual({ msg: "Password or Username are not provided" });
    done();
  });
});

// describe("Sample Test for login", () => {
//   it("test login", async (done) => {
//     const dbStatus = await db.sequelize.sync();
//     console.log("DB Setup is Done");
//     const agent = supertest.agent(app);

//     const login = await agent
//       .post("/auth/login/")
//       .send({ username: "abc", password: "abc" });

//     console.log("Got a login", login.statusCode);
//     const authCheck = await agent.get("/auth/session/");
//     expect(authCheck.statusCode).toBe(200);

//     console.log("From the test", authCheck.statusCode);

//     // await agent.get("/auth/session").expect("Content-Type", /json/).expect(200);
//     db.sequelize.close();
//     done();
//   });
// });
