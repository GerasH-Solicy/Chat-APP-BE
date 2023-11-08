const { User } = require("../../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.send({ success: true, data: users });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const findUserByNickname = async (req, res) => {
  try {
    const { nickname } = req.params;

    if (!nickname) {
      return res.send({
        success: false,
        message: "Nickname parameter is missing.",
      });
    }

    const users = await User.find({
      nickname: { $regex: new RegExp(nickname, "i") },
    });

    res.send({ success: true, data: users });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, findUserByNickname };
