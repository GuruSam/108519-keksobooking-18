'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  var Map = {
    width: 1200,
    minY: 130,
    maxY: 630,
    offerAmount: 8
  };

  /**
   * Параметры метки объявления.
   */
  var pinParams = {
    width: 50,
    height: 70
  };

  /**
   * Параметры перетаскиваемой метки.
   */
  var selfPinParams = {
    width: 65,
    height: 65,
    arrow: 15
  };

  var mapOverlay = document.querySelector('.map__overlay');
  /**
   * Доступное поле для перемещения метки.
   */
  var pinField = {
    minX: mapOverlay.offsetLeft - selfPinParams.width / 2,
    maxX: mapOverlay.offsetLeft + Map.width - selfPinParams.width / 2,
    minY: mapOverlay.offsetTop + Map.minY - selfPinParams.height / 2,
    maxY: mapOverlay.offsetTop + Map.maxY
  };

  var togglePageState = function () {
    var map = document.querySelector('.map');
    var adForm = document.querySelector('.ad-form');

    if (window.pageActive) {
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

  window.util = {
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESC_KEYCODE: ESC_KEYCODE,
    map: Map,
    pin: pinParams,
    selfPin: selfPinParams,
    pinField: pinField,
    togglePageState: togglePageState,
  };
  window.pageActive = false;
})();

