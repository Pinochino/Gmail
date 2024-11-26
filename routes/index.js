const homeRouter = require("./homepage");
const registerRouter = require("./register");
const inboxRouter = require("./inboxpage");
const composeRouter = require("./composepage");
const outboxRouter = require("./outboxpage");
const emailRouter = require("./emailpage");

function route(app) {
  app.use("/", homeRouter);
  app.use("/register", registerRouter);
  app.use("/inbox", inboxRouter);
  app.use("/outbox", outboxRouter);
  app.use("/compose", composeRouter);
  app.use("/email-detail", emailRouter);
}

module.exports = route;
