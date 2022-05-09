const { Model, DataTypes } = require("sequelize");

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init({
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shortIntroduction: {
        type: DataTypes.STRING,
        allowNull: true
      },
      introduction: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: "User",
      tableName: "users",
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post);
  }
};
