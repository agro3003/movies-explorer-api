const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const ErrorConflict = require('../errors/errorconflict');
const ErrorNotFound = require('../errors/errornotfound');
const ErrorUnauthorized = require('../errors/errorunauthorized');
const ErrorBadRequest = require('../errors/errorsbadrequest');

const SALT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  if (!validator.isEmail(email)) throw new ErrorBadRequest('Формат email неправельный');
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(200).send({
      data: {
        name,
        email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) next(new ErrorConflict('пользователь с таким email уже существует'));
      if (err.name === 'ValidationError') next(new ErrorBadRequest('переданы некорректные данные'));
      next(err);
    });
};

const getAuthUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  if (!validator.isEmail(email) || !password) throw new ErrorBadRequest('Формат данных неправельный');
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new ErrorUnauthorized('Неправильная почта или пароль');
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) throw new ErrorUnauthorized('Неправильная почта или пароль');
          const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  if (!validator.isEmail(req.body.email)) throw new ErrorBadRequest('Формат email неправельный');
  User.findByIdAndUpdate(
    (req.user._id),
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) throw new ErrorNotFound('Пользователь с указанным _id не найдена.');
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new ErrorBadRequest('переданы некорректные данные'));
      if (err.code === 11000) next(new ErrorConflict('пользователь с таким email уже существует'));
      next(err);
    });
};

module.exports = {
  createUser,
  updateProfile,
  login,
  getAuthUserInfo,
};
