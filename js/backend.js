'use strict';

(function () {
  var OFFERS_URL = 'https://js.dump.academy/keksobooking/data';
  var STATUS_OK = 200;

  var load = function (onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', OFFERS_URL);

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        errorHandler('Ошибка загрузки похожих объявлений');
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.send();
  };

  var errorHandler = function (errorMessage) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorBlock = errorTemplate.cloneNode(true);

    errorBlock.querySelector('.error__message').textContent = errorMessage;
    document.querySelector('main').appendChild(errorBlock);
  };

  window.backend = {
    load: load,
    errorHandler: errorHandler
  };
})();
