const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');

const Group = sequelize.define(
  'group',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'group',
  },
);

// An user can create many groups
Group.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

module.exports = Group;
