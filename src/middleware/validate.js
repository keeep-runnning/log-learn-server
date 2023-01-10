import { validationResult } from "express-validator";

import BadRequestError from "../error/common/BadRequestError.js";

export default function validate(req, res, next) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    throw new BadRequestError({
      errors: validationErrors.array().map(({ param, value, msg }) => ({
        field: param,
        value,
        reason: msg,
      })),
    });
  }
  next();
}
