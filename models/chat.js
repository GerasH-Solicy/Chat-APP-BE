const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
  },
});

const Chat = mongoose.model("chat", ChatSchema);

module.exports = { Chat };
