'use strict';

(function () {
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successBlock = successTemplate.cloneNode(true);

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorBlock = errorTemplate.cloneNode(true);

  /**
   * Удаляет сообщение.
   *
   * @param {Element} block
   */
  var removeBlock = function (block) {
    if (block === successBlock) {
      successBlock.remove();
      successBlock.removeEventListener('click', onBlockClick);
    } else {
      errorBlock.remove();
      errorBlock.removeEventListener('click', onBlockClick);
    }
  };

  /**
   * Показывает сообщение об успехе.
   */
  var showSuccessPopup = function () {
    successBlock.addEventListener('click', onBlockClick);
    document.addEventListener('keydown', onBlockEscPress);
    document.querySelector('main').appendChild(successBlock);
  };

  /**
   * Показывает сообщение об ошибке.
   *
   * @param {String} errorMessage
   */
  var showErrorPopup = function (errorMessage) {
    errorBlock.querySelector('.error__message').textContent = errorMessage;

    errorBlock.addEventListener('click', onBlockClick);
    document.addEventListener('keydown', onBlockEscPress);

    document.querySelector('main').appendChild(errorBlock);
  };

  var onBlockClick = function (evt) {
    removeBlock(evt.currentTarget);
  };

  var onBlockEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      removeBlock(document.querySelector('main').lastChild);
      document.removeEventListener('keydown', onBlockEscPress);
    }
  };

  window.popup = {
    showSuccess: showSuccessPopup,
    showError: showErrorPopup
  };
})();
