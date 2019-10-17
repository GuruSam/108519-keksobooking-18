'use strict';

(function () {
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successPopup = successTemplate.cloneNode(true);

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorPopup = errorTemplate.cloneNode(true);

  /**
   * Удаляет сообщение.
   *
   * @param {Element} popup
   */
  var closePopup = function (popup) {
    popup.removeEventListener('click', onPopupClick);
    popup.remove();
  };

  /**
   * Показывает сообщение об успехе.
   */
  var showSuccessPopup = function () {
    successPopup.addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscPress);
    document.querySelector('main').appendChild(successPopup);
  };

  /**
   * Показывает сообщение об ошибке.
   *
   * @param {String} errorMessage
   */
  var showErrorPopup = function (errorMessage) {
    errorPopup.querySelector('.error__message').textContent = errorMessage;

    errorPopup.addEventListener('click', onPopupClick);
    document.addEventListener('keydown', onPopupEscPress);

    document.querySelector('main').appendChild(errorPopup);
  };

  var onPopupClick = function (evt) {
    closePopup(evt.currentTarget);
  };

  var onPopupEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      closePopup(document.querySelector('main').lastChild);
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  window.popup = {
    showSuccess: showSuccessPopup,
    showError: showErrorPopup
  };
})();
