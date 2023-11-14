/* eslint-disable */
const { User, Organization, OrganizationUser } = require('../models');

const tables = [User, Organization, OrganizationUser];

async function syncTables() {
  for (const table of tables) {
    try {
      await table.sync({ force: true }); // drop
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