import Sequelize from "sequelize";
import { dbConfig } from "../config/config.js";
import User from "./user.js";
import Post from "./post.js";

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

User.init(sequelize);
Post.init(sequelize);

db.User = User;
db.Post = Post;

User.associate(db);
Post.associate(db);

db.sequelize = sequelize;

export default db;
