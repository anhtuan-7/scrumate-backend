const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');
const Project = require('./project');

const Sprint = sequelize.define(
  'sprint',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sprintGoal: {
      type: DataTypes.TEXT,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 2, // 2 Weeks
    },
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Project,
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
  },
  {
    tableName: 'sprint',
  },
);

module.exports = Sprint;
