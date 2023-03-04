import jwt from "jsonwebtoken";

import config from "./config.js";

export function createToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresInSecond,
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
}
