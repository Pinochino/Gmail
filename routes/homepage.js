const { Router } = require("express");
const HomeController = require("../controller/HomeController");

const route = Router();
const homeController = new HomeController();

route.get("/", homeController.index);
route.post("/", homeController.login);

module.exports = route;
