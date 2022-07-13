const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

const mongoose = require('mongoose');
const { errors } = require('celebrate');

const cors = require('cors');

const router = require('./routes');
const { errorServer } = require('./middlewares/errorserver');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_PATH } = process.env;

const app = express();

app.use(helmet());

mongoose.connect(DB_PATH);

app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cors());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorServer);

app.listen(PORT);
