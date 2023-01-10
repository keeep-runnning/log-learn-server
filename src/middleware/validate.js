import { validationResult } from "express-validator";

import AppError from "../error/AppError.js";

export default function validate(req, res, next) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw new AppError({
      message: "올바르지 않은 요청입니다",
      statusCode: 400,
      errors: validationErrors.array().map(({ param, value, msg }) => ({
        field: param,
        value,
        reason: msg,
      })),
    });
  }
  next();
}
