import Sequelize from "sequelize";

import config from "../config.js";
import User from "./user.js";
import Post from "./post.js";

const db = {};

const sequelize = new Sequelize(config.db.url);

User.init(sequelize);
Post.init(sequelize);

db.User = User;
db.Post = Post;

User.associate(db);
Post.associate(db);

db.sequelize = sequelize;

export default db;
