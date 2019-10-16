'use strict';

(function () {
  var mapSection = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var pageActive = false;

  var activatePage = function () {
    if (!pageActive) {
      pageActive = true;
      mapSection.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

      window.backend.request(onLoadSuccess, onLoadError);
      window.form.toggleFormsState(adForm);
    }
  };

  var deactivatePage = function () {
    if (pageActive) {
      pageActive = false;

      mapSection.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');

      window.pin.removeList();
      window.card.remove();
      window.mainPin.reset();
      window.form.toggleFormsState(adForm);
      window.form.toggleFormsState(filterForm);
    }
  };

  var onLoadError = function () {
    window.backend.showErrorPopup('Не удалось загрузить объявления');
  };

  var onLoadSuccess = function (data) {
    window.offers = data;
    window.pin.renderList(window.offers);
    window.form.toggleFormsState(filterForm);
  };

  window.addEventListener('load', function () {
    window.form.toggleFormsState(adForm);
    window.form.toggleFormsState(filterForm);
  });

  window.page = {
    activate: activatePage,
    deactivate: deactivatePage
  };
})();
