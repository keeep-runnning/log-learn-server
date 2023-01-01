import passport from "passport";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";

import * as userRepository from "../repository/user.js";
import BusinessError from "../errors/BusinessError.js";

const LocalStrategy = passportLocal.Strategy;

export default function () {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const userFoundByEmail = await userRepository.findByEmail(email);
          if (userFoundByEmail) {
            const isPasswordValid = await bcrypt.compare(password, userFoundByEmail.password);
            if (isPasswordValid) {
              done(null, userFoundByEmail);
              return;
            }
          }
          const loginFailError = new BusinessError({
            message: "이메일 혹은 비밀번호가 유효하지 않습니다.",
            statusCode: 401,
            errorCode: "auth-001",
          });
          done(loginFailError);
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
}
