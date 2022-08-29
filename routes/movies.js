const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../middlewares/celebratecustom');

const {
  createMovie,
  getUserMovies,
  removeMovie,
} = require('../controllers/movies');

router.get('/movies', getUserMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(130).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(3000).required(),
    image: Joi.string().required().custom(validateURL),
    trailerLink: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().min(2).max(300).required(),
    nameEN: Joi.string().min(2).max(300).required(),
  }),
}), createMovie);

router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), removeMovie);

module.exports = router;
