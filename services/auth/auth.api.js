const express = require("express");
const router = express.Router();

const { signUp, checkToken, login } = require("./auth.api.handler");

router.post("/signup", signUp);
router.post("/login", login);
router.get("/checkToken", checkToken);

module.exports = router;
