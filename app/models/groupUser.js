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
      defaultValue: 'inactive',
    },
    lastAccessed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'group_user',
  },
);

Group.belongsToMany(User, {
  through: { model: GroupUser, as: 'metadata' },
  foreignKey: 'groupId',
});
User.belongsToMany(Group, {
  through: { model: GroupUser, as: 'metadata' },
  foreignKey: 'userId',
});

// Super Many-to-Many relationship
Group.hasMany(GroupUser, { foreignKey: 'groupId', as: 'data' });
GroupUser.belongsTo(Group, { foreignKey: 'groupId', as: 'data' });

Group.addHook('afterCreate', async (group) => {
  await GroupUser.create({
    groupId: group.id,
    userId: group.creatorId,
    role: 'admin',
  });
});

module.exports = GroupUser;
