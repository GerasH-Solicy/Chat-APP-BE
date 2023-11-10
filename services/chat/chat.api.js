const express = require("express");
const router = express.Router();

const {
  createChat,
  getAllChats,
  addMembers,
  changeMemberRole,
  deleteMember,
} = require("./chat.api.handler");

router.post("/create", createChat);
router.get("/getAll/:id", getAllChats);
router.post("/addMember", addMembers);
router.put("/member/change-role", changeMemberRole);
router.delete("/deleteMember", deleteMember);

module.exports = router;
