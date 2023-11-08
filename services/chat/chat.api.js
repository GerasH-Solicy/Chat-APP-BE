const express = require("express");
const router = express.Router();

const { createChat, getAllChats, addMember } = require("./chat.api.handler");

router.post("/create", createChat);
router.get("/getAll/:id", getAllChats);
router.post("/addMember", addMember);

module.exports = router;
