import passport from "passport";

import local from "./localStrategy.js";
import * as userRepository from "../repository/user.js";

export default function () {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    userRepository
      .findById(userId)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });

  local();
}
