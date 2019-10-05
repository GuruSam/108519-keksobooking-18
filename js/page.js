'use strict';

(function () {
  /**
   * Текущее состояние страницы.
   */
  var pageActive = false;

  /**
   * Изменяет состояние страницы.
   */
  var togglePageState = function () {
    var map = document.querySelector('.map');
    var adForm = document.querySelector('.ad-form');

    if (pageActive) {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      window.pageActive = false;

      window.form.toggleFormsState();
    } else {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      window.pageActive = true;

      window.form.toggleFormsState();
      window.pin.renderList();
    }

    window.form.setAddress();
  };

  window.addEventListener('load', function () {
    window.form.toggleFormsState();
    window.form.setAddress();
    window.backend.load(function (data) {
      window.offers = data;
    });
  });

  window.pageActive = pageActive;
  window.togglePageState = togglePageState;
})();
