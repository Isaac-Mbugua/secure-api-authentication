const { DataTypes, Model } = require("sequelize");
const sequelize = require("../utils/db");

class User extends Model {}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: true }
);

module.exports = User;
