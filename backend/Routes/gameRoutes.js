const express = require("express");
const router = express.Router();
const { updateScore } = require("../Controllers/gameController");
const authMiddleware = require("../Middlewares/AuthJWT");

router.post("/update-score", authMiddleware, updateScore);

module.exports = router;
