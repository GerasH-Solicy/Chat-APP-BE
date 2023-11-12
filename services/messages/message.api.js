const express = require("express");
const router = express.Router();

const { getChatMessages, deleteMessage } = require("./message.api.handler");

router.get("/chat/:id", getChatMessages);
router.delete("/:id", deleteMessage);


module.exports = router;
