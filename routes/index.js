const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { auth } = require('../middlewares/auth');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const {
  login,
  createUser,
} = require('../controllers/users');
const ErrorNotFound = require('../errors/errornotfound');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/', moviesRouter);
router.use('/', usersRouter);

router.use('/', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

module.exports = router;
