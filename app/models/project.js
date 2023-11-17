const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');
const Group = require('./group');

const Project = sequelize.define('project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: null,
  },
  description: {
    type: DataTypes.TEXT,
  },
  groupId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Group,
      key: 'id',
    },
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = Project;
