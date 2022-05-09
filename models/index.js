const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Post = require("./post");

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

User.init(sequelize);
Post.init(sequelize);

db.User=User;
db.Post=Post;

User.associate(db);
Post.associate(db);

db.sequelize = sequelize;

module.exports = db;
