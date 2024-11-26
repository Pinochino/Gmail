const { Router } = require("express");
const OutboxController = require("../controller/OutboxController");
const authMiddleWare = require("../middleware/authMiddleWare");

const route = Router();
const outboxController = new OutboxController();

route.get("/", authMiddleWare, outboxController.read);
route.post("/", outboxController.handleFormAction);

module.exports = route;
