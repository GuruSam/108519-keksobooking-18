'use strict';

(function () {
  var mapSection = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var pageActive = false;

  /**
   * Перевод страницы в активное состояние.
   */
  var activatePage = function () {
    if (!pageActive) {
      pageActive = true;
      mapSection.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

      window.backend.request(onLoadSuccess, onLoadError);
      window.form.toggleState(adForm);
    }
  };

  /**
   * Перевод страницы в неактивное состояние.
   */
  var deactivatePage = function () {
    if (pageActive) {
      pageActive = false;

      mapSection.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');

      window.pin.removeList();
      window.card.remove();
      window.mainPin.reset();

      window.form.toggleState(adForm);
      window.form.toggleState(filterForm);
    }
  };

  var onLoadError = function () {
    window.popup.showError('Не удалось загрузить объявления');
  };

  var onLoadSuccess = function (data) {
    window.offers = data;
    window.pin.renderList(window.offers);
    window.form.toggleState(filterForm);
  };

  // Отключить формы при загрузке.
  window.addEventListener('load', function () {
    window.form.toggleState(adForm);
    window.form.toggleState(filterForm);
  });

  window.page = {
    activate: activatePage,
    deactivate: deactivatePage
  };
})();
