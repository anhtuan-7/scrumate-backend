const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');
const Group = require('./group');

const Project = sequelize.define(
  'project',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: null,
    },
    key: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    repository: {
      type: DataTypes.TEXT,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    tableName: 'project',
    indexes: [
      {
        unique: true,
        fields: ['name', 'group_id'],
      },
    ],
  },
);

Group.hasMany(Project, { foreignKey: 'groupId' });
Project.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(Project, { foreignKey: 'creatorId' });
Project.belongsTo(User, { as: 'projectCreator', foreignKey: 'creatorId' });

module.exports = Project;
