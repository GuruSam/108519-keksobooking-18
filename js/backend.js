'use strict';

(function () {
  var Url = {
    LOAD_OFFERS: 'https://js.dump.academy/keksobooking/data',
    SAVE: 'https://js.dump.academy/keksobooking'
  };
  var STATUS_OK = 200;
  var XHR_TIMEOUT = 8000;

  /**
   * Запрос к серверу.
   *
   * @param {requestCallback} onSuccess
   * @param {requestCallback} onError
   * @param {*} data
   */
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
      showErrorPopup('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      showErrorPopup('Превышено время ожидания');
    });

    if (data) {
      xhr.open('POST', Url.SAVE);
      xhr.send(data);
    } else {
      xhr.open('GET', Url.LOAD_OFFERS);
      xhr.send();
    }

  };

  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successBlock = successTemplate.cloneNode(true);

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorBlock = errorTemplate.cloneNode(true);

  var removeBlock = function (block) {
    if (block === successBlock) {
      successBlock.remove();
    } else {
      errorBlock.remove();
    }
  };

  var onBlockClick = function (evt) {
    removeBlock(evt.target);
    evt.target.removeEventListener('click', onBlockClick);
  };

  var onBlockEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      removeBlock(document.querySelector('main').lastChild);
      document.removeEventListener('keydown', onBlockEscPress);
    }
  };

  var showSuccessPopup = function () {
    successBlock.addEventListener('click', onBlockClick);
    document.addEventListener('keydown', onBlockEscPress);
    document.querySelector('main').appendChild(successBlock);
  };

  var showErrorPopup = function (errorMessage) {
    errorBlock.querySelector('.error__message').textContent = errorMessage;

    errorBlock.addEventListener('click', onBlockClick);
    document.addEventListener('keydown', onBlockEscPress);

    document.querySelector('main').appendChild(errorBlock);
  };

  window.backend = {
    request: request,
    showSuccessPopup: showSuccessPopup,
    showErrorPopup: showErrorPopup
  };
})();
