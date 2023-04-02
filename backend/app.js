require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
// npm i -const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middlewares/error-middleware');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes/index');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1  minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'to many request from this IP ',
});

const corsOptions = {
  origin: ['http://mesto.pavelsm.nomoredomains.work', 'https://mesto.pavelsm.nomoredomains.work', `https://pavelsm.com/`, 'http://pavelsm.com/'],
};

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors(corsOptions));

app.use(helmet());

app.use(bodyParser.json());
// app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

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
