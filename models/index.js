const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

User.init(sequelize);
db.User=User;

db.sequelize = sequelize;

module.exports = db;
