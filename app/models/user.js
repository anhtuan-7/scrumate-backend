const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const { hashPassword } = require('../utils/auth');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'user',
    indexes: [{ unique: true, fields: ['email'] }],
    hooks: {
      beforeSave: (user) => {
        if (user.password) user.password = hashPassword(user.password);
      },
      beforeFind: (options) => {
        options.where = { active: true };
      },
    },
  },
);

module.exports = User;
