const { Model, DataTypes } = require("sequelize");

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: "Post",
      tableName: "posts",
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: "authorId", targetKey: "id" });
  }
};
