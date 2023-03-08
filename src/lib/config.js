import * as dotenv from "dotenv";

dotenv.config();

const config = {
  morgan: {
    format: getEnvOrDefaultValue("MORGAN_FORMAT", "dev"),
  },
  cors: {
    origin: getEnvOrDefaultValue("CORS_ORIGIN"),
  },
  bcrypt: {
    saltRounds: parseInt(getEnvOrDefaultValue("BCRYPT_SALT_ROUNDS", "10")),
  },
  jwt: {
    secret: getEnvOrDefaultValue("JWT_SECRET"),
    expiresInSecond: parseInt(getEnvOrDefaultValue("JWT_EXPIRES_IN_SECOND")),
  },
  port: parseInt(getEnvOrDefaultValue("PORT", "8080")),
  env: getEnvOrDefaultValue("NODE_ENV", "development"),
};

function getEnvOrDefaultValue(key, defaultValue = null) {
  const value = process.env[key] ?? defaultValue;
  if (value === null) {
    throw new Error(`환경변수(${key}) 값이 설정되지 않았습니다`);
  }
  return value;
}

export default config;
