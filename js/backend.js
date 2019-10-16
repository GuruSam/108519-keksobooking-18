'use strict';

(function () {
  var Url = {
    LOAD_OFFERS: 'https://js.dump.academy/keksobooking/data',
    SAVE: 'https://js.dump.academy/keksobooking'
  };
  var STATUS_OK = 200;
  var XHR_TIMEOUT = 8000;

  var request = function (onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = XHR_TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });
    xhr.addEventListener('error', function () {
      window.popup.showError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      window.popup.showError('Превышено время ожидания');
    });

    if (data) {
      xhr.open('POST', Url.SAVE);
      xhr.send(data);
    } else {
      xhr.open('GET', Url.LOAD_OFFERS);
      xhr.send();
    }
  };

  window.backend = {
    request: request
  };
})();
