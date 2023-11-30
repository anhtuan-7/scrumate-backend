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
      beforeSave: async (user) => {
        if (user.password) user.password = await hashPassword(user.password);
      },
      beforeFind: (options) => {
        if (options.where) options.where.active = true;
        else options.where = { active: true };

        // options.attributes.
      },
    },
  },
);

module.exports = User;
