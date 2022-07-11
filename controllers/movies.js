const { Movie } = require('../models/movie');
const ErrorForbidden = require('../errors/errorforbidden ');
const ErrorNotFound = require('../errors/errornotfound');
const ErrorBadRequest = require('../errors/errorsbadrequest');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    thumbnail,
    owner: req.user._id,
    nameRU,
    nameEN,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) throw new ErrorNotFound('Видео с указанным _id не найдена.');
      if (!movie.owner.equals(req.user._id)) throw new ErrorForbidden('Недостаточно прав для удаления');
      Movie.findByIdAndDelete(req.params.movieId)
        .then((item) => {
          res.status(200).send(item);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new ErrorBadRequest('переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getUserMovies,
  removeMovie,
};
