const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.post("/start", chatbotController.startChat);

router.post("/message", chatbotController.sendMessageToChat);

router.post("/reset", chatbotController.resetChat);

module.exports = router;
