const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');
const Organization = require('./organization');

const OrganizationUser = sequelize.define(
  'organizationUser',
  {
    organizationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Organization,
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
  },
  {
    tableName: 'organization_user',
  },
);

Organization.belongsToMany(User, {
  through: OrganizationUser,
  foreignKey: 'organizationId',
});
User.belongsToMany(Organization, {
  through: OrganizationUser,
  foreignKey: 'userId',
});

Organization.addHook('afterCreate', async (org) => {
  await OrganizationUser.create({
    organizationId: org.id,
    userId: org.creatorId,
    role: 'admin',
  });
});

module.exports = OrganizationUser;
