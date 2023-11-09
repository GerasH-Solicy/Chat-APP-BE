const express = require("express");
const router = express.Router();

const { createChat, getAllChats, addMembers } = require("./chat.api.handler");

router.post("/create", createChat);
router.get("/getAll/:id", getAllChats);
router.post("/addMember", addMembers);

module.exports = router;
