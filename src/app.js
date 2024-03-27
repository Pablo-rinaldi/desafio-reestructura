const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const configObject = require("./config/config.js");
const { port, mongo_url, session_secret } = configObject;

const exphbs = require("express-handlebars");

const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

const app = express();

require("./database.js");

const sessionRouter = require("./routes/sessions.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(
  session({
    secret: session_secret,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongo_url,
      ttl: 100,
    }),
  })
);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", viewsRouter);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});
