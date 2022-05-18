const { validationResult, body } = require("express-validator");

const { BusinessError } = require("../../errors/BusinessError");

const validate = (validationMiddlewares) => [
  ...validationMiddlewares,
  (req, res, next) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) {
      const inValidError = new BusinessError({
        message: "올바르지 않은 요청입니다.",
        statusCode: 400,
        errorCode: "common-001",
        errors: validationErrors.array()
          .map(({ param, value, msg }) => ({
            field: param,
            value: value ?? "",
            reason: msg
          }))
      });
      return next(inValidError);
    }
    next();
  }
];

const validateUserCreationRequestBody = [
  body("username")
    .notEmpty()
    .withMessage("유저이름을 입력해주세요.").bail()
    .isLength({ min: 2, max: 20 })
    .withMessage("유저이름을 2자 이상 20자 이하로 입력해주세요.").bail()
    .matches(/^[ㄱ-ㅎ가-힣\w-]+$/)
    .withMessage("한글/영문 대소문자/숫자/언더바(_)/하이픈(-)만을 이용해 유저이름을 입력해주세요."),
  body("email")
    .notEmpty()
    .withMessage("이메일을 입력해주세요.").bail()
    .matches(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/)
    .withMessage("이메일 형식이 올바르지 않습니다."),
  body("password")
    .notEmpty()
    .withMessage("비밀번호를 입력해주세요.").bail()
    .isLength({ min: 8, max: 32 })
    .withMessage("비밀번호를 8자 이상 32자 이하로 입력해주세요.").bail()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/)
    .withMessage("영문 대소문자/숫자/특수문자를 각각 1자 이상 포함해주세요.")
];

const validatePostCreationRequestBody = [
  body("title")
    .not().isEmpty({ ignore_whitespace: true })
    .withMessage("블로그 포스트 제목을 입력해주세요.").bail().trim()
    .isLength({ max: 100 })
    .withMessage("블로그 포스트 제목은 최대 100자 까지 입력할 수 있습니다."),
  body("content")
    .not().isEmpty({ ignore_whitespace: true })
    .withMessage("블로그 포스트 내용을 입력해주세요.").trim()
];

module.exports = {
  validate,
  validateUserCreationRequestBody,
  validatePostCreationRequestBody
};
