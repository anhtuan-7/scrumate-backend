const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');

const Organization = sequelize.define(
  'organization',
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
    tableName: 'organization',
  },
);

// An user can create many groups
Organization.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

module.exports = Organization;
