'use strict';

(function () {
  var pageActive = false;

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

  window.pageActive = pageActive;
  window.togglePageState = togglePageState;
})();
