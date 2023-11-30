const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const User = require('./user');
const Project = require('./project');

const ProjectUser = sequelize.define(
  'projectUser',
  {
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Project,
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
      type: DataTypes.ENUM(['product-owner', 'scrum-master', 'developer']),
      allowNull: false,
      defaultValue: 'developer',
    },
    lastAccessed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'project_user',
  },
);

Project.belongsToMany(User, { through: ProjectUser, foreignKey: 'projectId' });
User.belongsToMany(Project, { through: ProjectUser, foreignKey: 'userId' });

// Super Many-to-Many relationship
Project.hasMany(ProjectUser, { foreignKey: 'projectId' });
ProjectUser.belongsTo(Project, { foreignKey: 'projectId' });
User.hasMany(ProjectUser, { foreignKey: 'userId' });
ProjectUser.belongsTo(User, { foreignKey: 'userId' });

Project.addHook('afterCreate', async (group) => {
  await ProjectUser.create({
    projectIdId: group.id,
    userId: group.creatorId,
    role: 'scrum-master',
  });
});

module.exports = ProjectUser;
