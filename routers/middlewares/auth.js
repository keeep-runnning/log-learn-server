const { BusinessError } = require("../../errors/BusinessError");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const notLoggedInError = new BusinessError({
      errorCode: "common-002",
      message: "로그인이 필요합니다.",
      statusCode: 401,
    });
    return next(notLoggedInError);
  }
  next();
};

module.exports = { isLoggedIn };
