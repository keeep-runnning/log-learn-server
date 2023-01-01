import { validationResult } from "express-validator";

import BusinessError from "../errors/BusinessError.js";

export default function validate(req, res, next) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw new BusinessError({
      message: "올바르지 않은 요청입니다.",
      statusCode: 400,
      errorCode: "common-001",
      errors: validationErrors.array().map(({ param, value, msg }) => ({
        field: param,
        value: value ?? "",
        reason: msg,
      })),
    });
  }
  next();
}
