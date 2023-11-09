const { Chat } = require("../../models/chat");
const { User } = require("../../models/user");

const createChat = async (req, res) => {
  try {
    const { name, owner } = req.body;

    const user = await User.findById(owner);

    const userData = {
      nickname: user.nickname,
      id: user.id,
      role: "user",
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
    res.send({ chats });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const addMembers = async (req, res) => {
  try {
    const { chatOwnerId, chatId, userIds } = req.body;

    // const chatOwnerUser = 

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

module.exports = { createChat, getAllChats, addMembers };
