const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const jwtKey = "asdjsadldjadajndadhlbsadajdnli1qwosamkdna";

const signUp = async (req, res) => {
  try {
    const { nickname, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newChatObject = {
      nickname,
      password: hashedPassword,
      email,
    };

    const existUser = await User.findOne({ nickname });
    if (existUser) {
      return res.send({ success: false, message: "Nickname already in use." });
    }

    const user = await User.create(newChatObject);

    const token = jwt.sign({ userId: user }, jwtKey, {
      expiresIn: "1h",
    });

    res.send({ success: true, data: user, token });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
      return res.send({
        success: false,
        message: "Submit both nickname and password.",
      });
    }

    const user = await User.findOne({ nickname });

    if (!user) {
      return res.send({
        success: false,
        message: "Invalid nickname or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.send({
        success: false,
        message: "Invalid nickname or password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, jwtKey, {
      expiresIn: "1h",
    });

    res.send({ success: true, data: user, token });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const checkToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.send({ success: false, message: "No token provided." });
    }

    let userId = null;

    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) {
        return res.send({
          success: false,
          message: "Failed to authenticate token.",
        });
      }
      userId = decoded.userId;
    });

    if (!userId) {
      return res.send({ success: false, message: "No `userId` under token." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.send({ success: false, message: "User not found." });
    }

    res.send({ success: true, user });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = { signUp, checkToken, login };
