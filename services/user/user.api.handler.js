const { Chat } = require("../../models/chat");
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
    const { nickname, chatId } = req.params;

    if (!chatId && !nickname) {
      return res.send({
        success: false,
        message: "Not all parameters passed.",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.send({
        success: false,
        message: "Chat not found.",
      });
    }

    const { members } = chat;

    const users = await User.find({
      nickname: { $regex: new RegExp(nickname, "i") },
    });

    const nonMembers = users.filter(
      (user) => !members.some((member) => member.nickname === user.nickname)
    );

    res.send({ success: true, data: nonMembers });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, findUserByNickname };
