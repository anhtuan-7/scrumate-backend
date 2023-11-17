/* eslint-disable no-console */
const dotenv = require('dotenv');

dotenv.config({ path: './.env.local', override: false });

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception. Shutting down...');
  console.log(err);
  process.exit(1);
});

const app = require('./app');
require('./models/connection');
require('./utils/dbSync');

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection. Shutting down...');
  console.log(err);
  server.close(() => process.exit(1));
});
