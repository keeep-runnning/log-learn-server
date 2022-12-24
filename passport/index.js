import passport from "passport";
import local from "./localStrategy.js";
import db from "../models/index.js";

export default function () {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    db.User.findOne({ where: { id: userId } })
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });

  local();
}
