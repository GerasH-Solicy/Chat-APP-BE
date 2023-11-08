const express = require("express");
const router = express.Router();

const { getChatMessages } = require("./message.api.handler");

router.get("/chat/:id", getChatMessages);

module.exports = router;
