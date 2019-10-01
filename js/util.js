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

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
  };

  var getRandomArrayItem = function (arr) {
    var i = Math.floor(Math.random() * arr.length);
    return arr[i];
  };

  var getRandomArray = function (arr) {
    var length = getRandomNumber(1, arr.length);
    var array = [];

    for (var i = 0; i < length; i++) {
      array.push(arr[i]);
    }

    return array;
  };

  window.util = {
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESC_KEYCODE: ESC_KEYCODE,
    map: Map,
    pin: pinParams,
    selfPin: selfPinParams,
    getRandomNumber: getRandomNumber,
    getRandomArray: getRandomArray,
    getRandomArrayItem: getRandomArrayItem,
  };
})();

