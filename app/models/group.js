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

User.hasMany(Group, { foreignKey: 'creatorId' });
Group.belongsTo(User, { as: 'groupCreator', foreignKey: 'creatorId' });

module.exports = Group;
