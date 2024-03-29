/* eslint-disable */
const dotenv = require('dotenv');
dotenv.config({ path: './.env.local', override: false });

const {
  User,
  Group,
  GroupUser,
  Project,
  ProjectUser,
  Sprint,
  Issue,
} = require('../models');

const tables = [User, Group, GroupUser, Project, ProjectUser, Sprint, Issue];

async function syncTables() {
  for (const table of tables) {
    try {
      await table.sync({ alter: true }); // drop
      console.log(`${table.tableName} table synced`);
    } catch (err) {
      throw err;
    }
  }
}

// DEV-ONLY
syncTables()
  .then(() => {
    console.log('All tables were synchronized successfully.');
  })
  .catch((error) => {
    console.error('Error synchronizing tables:', error);
  });
