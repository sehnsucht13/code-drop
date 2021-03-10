const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  const { password } = req.body;
  const { username } = req.body;
  if (password === undefined || username === undefined) {
    res.status(401).json({ msg: "Password or Username are not provided" });
    return;
  }

  try {
    // Check if the user exists
    const existingUser = await req.app.locals.db.Users.findOne({
      where: {
        username,
      },
    });

    if (existingUser !== null) {
      res.status(200).json({ status: "TAKEN" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await req.app.locals.db.Users.create({
      username,
      password: hashedPassword,
    });
    res.status(200).json({ status: "OK" });
  } catch (err) {
  	console.log("ERROR REGISTER", err);
    res.status(500).end();
  }
};

const logoutUser = async (req, res) => {
  if (req.user !== undefined) {
    req.session.destroy((err) => {
      if (err === undefined || err === null) {
        req.logout();
        res.status(200).end();
      } else {
        res.status(500).end();
      }
    });
  } else {
    res.status(200).end();
  }
};

const getUserSession = async (req, res) => {
  res.status(200).send(req.user);
};

module.exports = {
  logoutUser,
  registerUser,
  getUserSession,
};
