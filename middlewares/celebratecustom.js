const ErrorBadRequest = require('../errors/errorsbadrequest');

const regExpURL = /^https?:\/\/(www\.)?[-\w:%.+~#=]{1,256}\.[a-z0-9()]{1,6}([-\w()@:%.+~#=//?&]*)/;

const validateURL = (value) => {
  if (!value.match(regExpURL)) {
    throw new ErrorBadRequest('Неправильный формат ссылки');
  }
  return value;
};

module.exports = {
  validateURL,
};
