const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');
const Sprint = require('./sprint');
const Project = require('./project');

const Issue = sequelize.define(
  'issue',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    sprintId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Sprint,
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'id',
      },
      // onDelete: 'SET NULL', // Default
    },
    type: {
      type: DataTypes.ENUM(['task', 'bug', 'story']),
      allowNull: false,
      defaultValue: 'task',
    },
    priority: {
      type: DataTypes.ENUM(['low', 'medium', 'high', 'best-effort']),
      allowNull: false,
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM(['to-do', 'in-progress', 'done']),
      allowNull: false,
      defaultValue: 'to-do',
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    assigneeId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'issue',
  },
);

Issue.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
Issue.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });

Project.hasMany(Issue, { foreignKey: 'projectId' });
Issue.belongsTo(Project, { foreignKey: 'projectId' });

module.exports = Issue;
