const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Error
const AppError = require('./errors/appError');
const errorHandler = require('./errors/errorHandler');
const { NOT_FOUND } = require('./common/statusCode');

// Route
const isJsonContentType = require('./middlewares/isJsonContentType');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const organizationRoute = require('./routes/organizationRoute');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app
  .route('*')
  .post(isJsonContentType)
  .patch(isJsonContentType)
  .put(isJsonContentType);

app.use('/api/v1/', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/organizations', organizationRoute);

app.use('*', (req, res, next) => {
  next(
    new AppError(
      NOT_FOUND,
      `${req.url} is not founded on this server or ${req.method} is not supported at ${req.url}`,
    ),
  );
});
app.use(errorHandler);

module.exports = app;
