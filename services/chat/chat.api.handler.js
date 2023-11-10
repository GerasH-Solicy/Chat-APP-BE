const { Chat } = require("../../models/chat");
const { User } = require("../../models/user");
const { Message } = require("../../models/message");

const createChat = async (req, res) => {
  try {
    const { name, owner } = req.body;

    const user = await User.findById(owner);

    const userData = {
      nickname: user.nickname,
      id: user.id,
      role: "admin",
    };

    const newChatObject = {
      name,
      members: [userData],
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

    const lastMessages = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({ chatId: chat.id })
          .sort({ createdAt: -1 })
          .limit(1);
        return { chat, lastMessage };
      })
    );

    res.send({ chats: lastMessages });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const addMembers = async (req, res) => {
  try {
    const { chatId, userIds } = req.body;

    if (!chatId || !userIds) {
      return res.send({
        success: false,
        message: "Submit all required params.",
      });
    }

    const userDatas = [];

    for (let i = 0; i < userIds.length; i++) {
      const user = await User.findById(userIds[i]);

      if (!user) {
        return res.send({
          success: false,
          message: `User  with id "${userIds[i]}" not found.`,
        });
      }

      const existingMember = await Chat.findOne({
        _id: chatId,
        "members.id": user.id,
      });

      if (existingMember) {
        return res.send({
          success: false,
          message: `User  with id "${userIds[i]}" already in this chat.`,
        });
      }

      const userData = {
        nickname: user.nickname,
        id: user.id,
        role: "user",
      };

      userDatas.push(userData);
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { members: { $each: userDatas } },
      },
      { new: true }
    );

    if (!chat) {
      return res.send({
        success: false,
        message: "Chat not found.",
      });
    }
    res.send({ success: true, members: userDatas });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const changeMemberRole = async (req, res) => {
  try {
    const { chatId, userId, role } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.send({
        success: false,
        message: `User  with id "${userId}" not found.`,
      });
    }

    const chat = await Chat.findById(chatId);

    const { members } = chat;

    const updatedMembers = members.map((el) => {
      if (el.id === userId) {
        return { ...el, role };
      }
      return el;
    });

    await Chat.findByIdAndUpdate(
      chatId,
      { members: updatedMembers },
      { new: true }
    );

    if (!chat) {
      return res.send({
        success: false,
        message: "Chat not found.",
      });
    }

    res.send({ success: true, members: updatedMembers });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, "members.id": userId },
      {
        $pull: { members: { id: userId } },
      },
      { new: true }
    );

    res.send({ success: true, chat });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = {
  createChat,
  getAllChats,
  addMembers,
  changeMemberRole,
  deleteMember,
};
