const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
require("./database");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secret;
const User = require("../models/user");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.use(
  new JWTstrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.user._id);
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  }),
);
