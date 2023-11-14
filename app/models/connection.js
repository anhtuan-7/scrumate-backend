const { Sequelize } = require('sequelize');

const db = {
  name: process.env.DATABASE_NAME,
  dialect: process.env.DATABASE_DIALECT,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  logging: () => process.env.NODE_ENV === 'development',
};

const sequelize = new Sequelize(db.name, db.username, db.password, {
  dialect: db.dialect,
  host: db.host,
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: false, //db.logging(),
});

module.exports = sequelize;

/* eslint-disable no-console */
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
checkConnection();
