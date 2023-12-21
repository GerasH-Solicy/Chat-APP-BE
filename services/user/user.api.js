const express = require("express");
const router = express.Router();

const { getAllUsers, findUserByNickname } = require("./user.api.handler");

router.get("/all", getAllUsers);
router.get("/find/:nickname/:chatId", findUserByNickname);

module.exports = router;
