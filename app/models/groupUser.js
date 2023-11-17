const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');
const Group = require('./group');

const GroupUser = sequelize.define(
  'groupUser',
  {
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Group,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM(['admin', 'project-admin', 'member', 'inactive']),
      allowNull: false,
      defaultValue: 'member',
    },
    lastAccess: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'group_user',
  },
);

Group.belongsToMany(User, {
  through: GroupUser,
  foreignKey: 'groupId',
});
User.belongsToMany(Group, {
  through: GroupUser,
  foreignKey: 'userId',
});

Group.addHook('afterCreate', async (group) => {
  await GroupUser.create({
    groupId: group.id,
    userId: group.creatorId,
    role: 'admin',
  });
});

module.exports = GroupUser;
