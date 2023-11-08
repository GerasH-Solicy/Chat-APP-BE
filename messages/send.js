const { Message } = require("../models/message");
const { User } = require("../models/user");

const sendMessage = async (newMessage) => {
  try {
    const { actor, text, chatId } = newMessage;

    const user = await User.findById(actor);

    if (!user) {
      return { success: false, message: "Actor not found" };
    }
    const userData = {
      nickname: user.nickname,
    };

    const message = await Message.create({ actor: userData, text, chatId });

    return { success: true, data: message };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

module.exports = { sendMessage };
