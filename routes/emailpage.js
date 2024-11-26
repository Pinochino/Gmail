const { Router } = require("express");
const EmailController = require("../controller/EmailController");
const authMiddleWare = require("../middleware/authMiddleWare");

const route = Router();
const emailController = new EmailController();

route.get("/:id", authMiddleWare, emailController.read);
route.get("/download/:id", emailController.downloadFile);

module.exports = route;
