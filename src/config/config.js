const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const { mode } = program.opts();

dotenv.config({
  path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo",
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  port: process.env.PORT,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  session_secret: process.env.SESSION_SECRET,
};

module.exports = configObject;
