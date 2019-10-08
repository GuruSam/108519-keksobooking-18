'use strict';

(function () {
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var pageActive = false;

  var activatePage = function () {
    if (!pageActive) {
      pageActive = true;
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

      window.form.toggleFormsState();
      window.form.setAddress();
      window.pin.renderList();
    }
  };

  var deactivatePage = function () {
    if (pageActive) {
      pageActive = false;

      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      adForm.reset();

      window.form.toggleFormsState();
      window.pin.removeList();
      window.card.remove();
      window.mainPin.reset();
    }
  };

  window.addEventListener('load', function () {
    window.form.toggleFormsState();
    window.form.setAddress();
    window.backend.load(function (data) {
      window.offers = data;
    });
  });

  window.page = {
    activate: activatePage,
    deactivate: deactivatePage
  };
})();
