import * as dotenv from "dotenv";

dotenv.config();

const config = {
  db: {
    url: getEnvOrDefaultValue("DB_URL"),
  },
  cookie: {
    secret: getEnvOrDefaultValue("COOKIE_SECRET"),
  },
  host: {
    port: parseInt(getEnvOrDefaultValue("HOST_PORT", "8080")),
  },
  morgan: {
    format: getEnvOrDefaultValue("MORGAN_FORMAT", "dev"),
  },
  cors: {
    origin: getEnvOrDefaultValue("CORS_ORIGIN"),
    credentials: Boolean(getEnvOrDefaultValue("CORS_CREDENTIALS")),
  },
};

function getEnvOrDefaultValue(key, defaultValue = null) {
  const value = process.env[key] ?? defaultValue;
  if (value === null) {
    throw new Error(`환경변수(${key}) 값이 설정되지 않았습니다`);
  }
  return value;
}

export default config;
