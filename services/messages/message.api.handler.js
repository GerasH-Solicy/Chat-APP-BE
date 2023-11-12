const { Message } = require("../../models/message");

const getChatMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const messages = await Message.find({ chatId: id });

    res.send({ success: true, data: messages });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.send({ success: false, message: "`id` is not provided." });
    }

    await Message.findByIdAndDelete(id);

    res.send({ success: true });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = { getChatMessages, deleteMessage };
