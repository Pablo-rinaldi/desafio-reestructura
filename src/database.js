const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

mongoose
  .connect(mongo_url)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) =>
    console.log("No pudo conectarse a la  base de datos", error)
  );
