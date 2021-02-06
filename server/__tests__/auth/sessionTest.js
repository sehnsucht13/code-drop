const { db, app } = require("../../expressSetup");
const supertest = require("supertest");

describe("Registration tests", () => {
  beforeAll(async (done) => {
    const dbStatus = await db.sequelize.sync();

    done();
  });

  afterAll(async (done) => {
    await db.sequelize.close();
    done();
  });

  it("Should return session info successfully", async (done) => {
    let agent = supertest.agent(app);
    const login = await agent
      .post("/auth/login/")
      .send({ username: "testUser1", password: "testUser1" });
    expect(login.statusCode).toBe(200);

    const session = await agent.get("/auth/session/");

    expect(session.statusCode).toBe(200);
    expect(session.body).toEqual({ username: "testUser1", uid: 8 });
    done();
  });

  it("Test session info with bad login", async (done) => {
    let agent = supertest.agent(app);
    const login = await agent
      .post("/auth/login/")
      .send({ username: "testUser1", password: "WRONG" });
    expect(login.statusCode).toBe(401);

    const session = await agent.get("/auth/session/");

    expect(session.statusCode).toBe(200);
    expect(session.body).toEqual({});
    done();
  });

  it("Test session info after logout", async (done) => {
    let agent = supertest.agent(app);
    const login = await agent
      .post("/auth/login/")
      .send({ username: "testUser1", password: "testUser1" });
    expect(login.statusCode).toBe(200);

    const sessionBeforLogout = await agent.get("/auth/session/");
    expect(sessionBeforLogout.statusCode).toBe(200);
    expect(sessionBeforLogout.body).toEqual({ username: "testUser1", uid: 8 });

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);

    const sessionLogin = await agent.get("/auth/session/");

    expect(sessionLogin.statusCode).toBe(200);
    expect(sessionLogin.body).toEqual({});
    done();
  });
});
