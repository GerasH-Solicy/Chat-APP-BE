const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  actor: {
    type: Object,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("messages", MessageSchema);

module.exports = { Message };
