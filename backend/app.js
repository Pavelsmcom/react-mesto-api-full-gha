require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cors = require('cors');
// npm i -const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middlewares/error-middleware');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./utils/errors/not-found-error');
const { validateSignIn, validateSignUp } = require('./utils/validation/validation');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/user');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: 'to many request from this IP ',
});

const corsOptions = {
  origin: ['http://mesto.pavelsm.nomoredomains.work', 'https://mesto.pavelsm.nomoredomains.work'],
};

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors(corsOptions));

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
// app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSignIn, login);
app.post('/signup', validateSignUp, createUser);

app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);
app.use('/*', (req, res, next) => {
  next(new NotFoundError('Not Found'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorMiddleware);

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connect to DataBase');
  })
  .catch((error) => {
    console.log(`Error DataBase ${error}`);
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
