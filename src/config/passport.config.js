const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../dao/models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const configObject = require("../config/config.js");
const { admin_email, admin_password } = configObject;

const GitHubStrategy = require("passport-github2");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await UserModel.findOne({ email });
          if (user) return done(null, false);

          let rol = "usuario";

          if (email === admin_email && password === admin_password) {
            rol = "admin";
          }

          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            rol,
          };

          let result = await UserModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("Este usuario no existe");
            return done(null, false);
          }

          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.21617fb483f8e38f",
        clientSecret: "75e7ef2d0ff607e0163eec4fc2fd028843e94fb2",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile: ", profile);
        try {
          let user = await UserModel.findOne({ email: profile._json.email });

          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 40,
              email: profile._json.email,
              password: "",
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
module.exports = initializePassport;
