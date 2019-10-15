'use strict';

(function () {
  var Url = {
    LOAD_OFFERS: 'https://js.dump.academy/keksobooking/data',
    SAVE: 'https://js.dump.academy/keksobooking'
  };
  var STATUS_OK = 200;

  var load = function (onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', Url.LOAD_OFFERS);

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка загрузки похожих объявлений');
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.send();
  };

  var save = function (data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 6000;

    xhr.open('POST', Url.SAVE);

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSaveSuccess();
      } else {
        onError('Не удалось сохранить объявление');
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Не удалось сохранить объявление');
    });

    xhr.send(data);
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
      evt.target.removeEventListener('keydown', onBlockEscPress);
    }
  };

  var onSaveSuccess = function () {
    successBlock.addEventListener('click', onBlockClick);
    document.addEventListener('keydown', onBlockEscPress);

    document.querySelector('main').appendChild(successBlock);
    document.querySelector('.ad-form__submit').removeAttribute('disabled');
    window.page.deactivate();
  };

  var onError = function (errorMessage) {
    errorBlock.querySelector('.error__message').textContent = errorMessage;

    errorBlock.addEventListener('click', onBlockClick);
    document.addEventListener('keydown', onBlockEscPress);

    document.querySelector('main').appendChild(errorBlock);
    document.querySelector('.ad-form__submit').removeAttribute('disabled');
  };

  window.backend = {
    load: load,
    save: save
  };
})();
