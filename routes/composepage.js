const { Router } = require("express");
const ComposeController = require("../controller/ComposeController");
const multer = require("multer");
const authMiddleWare = require("../middleware/authMiddleWare");
const fs = require("fs");

const route = Router();
const composeController = new ComposeController();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

route.get("/", authMiddleWare, composeController.index);
route.post("/", upload.single("myFile"), composeController.create);
route.get("/username", composeController.getRecipient);

module.exports = route;
