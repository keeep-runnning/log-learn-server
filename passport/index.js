import passport from "passport";
import local from "./localStrategy.js";
import * as usersRepository from "../repository/users.js";

export default function () {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    usersRepository
      .findById(userId)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });

  local();
}
