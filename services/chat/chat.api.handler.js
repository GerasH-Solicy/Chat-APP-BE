const { Chat } = require("../../models/chat");
const { User } = require("../../models/user");

const createChat = async (req, res) => {
  try {
    const { name, owner } = req.body;

    const newChatObject = {
      name,
      members: { id: owner, role: "admin" },
    };

    const chat = await Chat.create(newChatObject);

    res.send({ success: true, data: chat });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.send({ success: false, message: '"id" is required.' });
    }

    const chats = await Chat.find({ "members.id": id });
    res.send({ chats });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.send({
        success: false,
        message: "Submit all required params.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.send({
        success: false,
        message: "User not found.",
      });
    }

    const userData = {
      nickname: user.nickname,
      id: user.id,
      role: "user",
    };

    const chats = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { members: userData },
      },
      { new: true }
    );

    if (!chats) {
      return res.send({
        success: false,
        message: "Chat not found.",
      });
    }

    res.send({ success: true, chats });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = { createChat, getAllChats, addMember };
