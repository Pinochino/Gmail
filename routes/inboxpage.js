const { Router } = require("express");
const InboxController = require("../controller/InboxController");
const authMiddleWare = require("../middleware/authMiddleWare");

const route = Router();
const inboxController = new InboxController();

route.get("/", authMiddleWare, inboxController.readEmail);
route.delete("/logout", inboxController.logout);
route.post("/", inboxController.handleFormAction);

module.exports = route;
