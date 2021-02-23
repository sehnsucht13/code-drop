const { db, app } = require("../../expressSetup");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

describe("Profile Retrieve Tests", () => {
  const users = [
    {
      username: "profile_get_user_1",
      password: "profile_get_user_1",
    },
    {
      username: "profile_get_user_2",
      password: "profile_get_user_2",
    },
  ];
  // Store the profile id's
  let dropIds = [[], []];
  let userIds = [];
  beforeAll(async (done) => {
    await db.sequelize.sync();

    for (const [index, user] of users.entries()) {
      const upass = await bcrypt.hash(user.password, 10);

      const newUser = await db.Users.create({
        username: user.username,
        password: upass,
        description: "",
        numStars: 0,
        numForks: 0,
      });
      userIds.push(newUser.dataValues.id);

      for (const idx of [1, 2]) {
        const title = `public_drop_${user.username}_${idx}`;
        const publicDrop = await db.Drops.create({
          title: title,
          lang: "python",
          visibility: true,
          text: "Some text here",
          description: "Test Description",
          userId: newUser.dataValues.id,
        });

        dropIds[index].push(publicDrop.dataValues.id);
      }
      const privateDrop = await db.Drops.create({
        title: `private_drop_${user.username}`,
        lang: "c++",
        visibility: false,
        text: "Some text here",
        description: "Test Description",
        userId: newUser.dataValues.id,
      });
      dropIds[index].push(privateDrop.dataValues.id);
    }
    done();
  });

  afterAll(async (done) => {
    for (const user of users) {
      const userModel = await db.Users.findOne({
        where: { username: user.username },
      });
      for (const idx of [1, 2]) {
        const publicDrop = await db.Drops.findOne({
          where: {
            userId: userModel.dataValues.id,
            title: `public_drop_${user.username}_${idx}`,
          },
        });
        await publicDrop.destroy();
      }

      const privateDrop = await db.Drops.findOne({
        where: {
          userId: userModel.dataValues.id,
          title: `private_drop_${user.username}`,
        },
      });
      await privateDrop.destroy();
      await userModel.destroy();
    }
    await db.sequelize.close();
    done();
  });

  it("Find current user's profile while authenticated", async () => {
    let agent = supertest.agent(app);

    const loginResp = await agent.post("/auth/login/").send({ ...users[0] });
    expect(loginResp.statusCode).toBe(200);

    const sessionResp = await agent.get("/auth/session/");
    expect(sessionResp.statusCode).toBe(200);
    expect(sessionResp.body).not.toEqual({});
    const sessionId = sessionResp.body.uid;
    console.log(sessionId);

    const userResp = await agent.get(`/user/${sessionId}/profile`);
    expect(userResp.statusCode).toBe(200);

    expect(userResp.body).toEqual({
      profile: {
        id: sessionId,
        username: users[0].username,
        description: "",
        numStars: 0,
        numForks: 0,
      },
      drops: [
        {
          id: dropIds[0][0],
          title: `public_drop_${users[0].username}_1`,
          lang: "python",
          userId: sessionId,
        },
        {
          id: dropIds[0][1],
          title: `public_drop_${users[0].username}_2`,
          lang: "python",
          userId: sessionId,
        },
        {
          id: dropIds[0][2],
          title: `private_drop_${users[0].username}`,
          lang: "c++",
          userId: sessionId,
        },
      ],
      counts: [
        { count: 1, lang: "c++" },
        { count: 2, lang: "python" },
      ],
    });

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);
  });

  it.todo("Find another user's profile while authenticated");

  it("Find existing user's profile while not authenticated", async () => {
    let agent = supertest.agent(app);
    let userResp = await agent.get(`/user/${userIds[0]}/profile`);
    expect(userResp.statusCode).toBe(200);

    expect(userResp.body).toEqual({
      profile: {
        id: userIds[0],
        username: users[0].username,
        description: "",
        numStars: 0,
        numForks: 0,
      },
      drops: [
        {
          id: dropIds[0][0],
          title: `public_drop_${users[0].username}_1`,
          lang: "python",
          userId: userIds[0],
        },
        {
          id: dropIds[0][1],
          title: `public_drop_${users[0].username}_2`,
          lang: "python",
          userId: userIds[0],
        },
      ],
      counts: [{ count: 2, lang: "python" }],
    });
  });

  it("Find nonexistant profile while authenticated", async (done) => {
    let agent = supertest.agent(app);

    const loginResp = await agent.post("/auth/login/").send({ ...users[1] });
    expect(loginResp.statusCode).toBe(200);

    let userProfileResp = await agent.get(`/user/9999999/profile`);
    expect(userProfileResp.statusCode).toBe(404);
    expect(userProfileResp.body).toEqual({});

    const logout = await agent.get("/auth/logout/");
    expect(logout.statusCode).toBe(200);

    done();
  });

  it("Find nonexistant profile while not authenticated", async (done) => {
    let agent = supertest.agent(app);

    let userProfileResp = await agent.get(`/user/9999999/profile`);
    expect(userProfileResp.statusCode).toBe(404);
    expect(userProfileResp.body).toEqual({});

    done();
  });
});
