'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var mapOverlay = document.querySelector('.map__overlay');

  /**
   * Параметры карты.
   */
  var map = {
    width: 1200,
    minY: 130,
    maxY: 630,
  };

  /**
   * Параметры перетаскиваемой метки.
   */
  var mainPinParams = {
    width: 65,
    height: 65,
    arrow: 15,
    initialX: 570,
    initialY: 375
  };

  /**
   * Доступное поле для перемещения метки.
   */
  var pinField = {
    minX: mapOverlay.offsetLeft - mainPinParams.width / 2,
    maxX: mapOverlay.offsetLeft + map.width - mainPinParams.width / 2,
    minY: mapOverlay.offsetTop + map.minY - mainPinParams.height / 2,
    maxY: mapOverlay.offsetTop + map.maxY
  };

  /**
   * Ограничивает перемещение метки вне карты.
   *
   * @param {Object} coords
   */
  var checkPinField = function (coords) {
    coords.x = Math.max(Math.min(coords.x, pinField.maxX), pinField.minX);
    coords.y = Math.max(Math.min(coords.y, pinField.maxY), pinField.minY);
  };

  /**
   * Текущая координата перетаскиваемой метки.
   *
   * @return {string}
   */
  var getLocation = function () {
    var pin = document.querySelector('.map__pin--main');
    var x = Math.floor(pin.offsetLeft + mainPinParams.width / 2);
    var y = Math.floor(pin.offsetTop + mainPinParams.height / 2);
    var mapElement = document.querySelector('.map');

    if (!mapElement.classList.contains('map--faded')) {
      y += Math.floor(mainPinParams.height / 2 + mainPinParams.arrow);
    }

    return x + ', ' + y;
  };

  /**
   * Сбрасывает метку в первоначальное состояние.
   */
  var reset = function () {
    mainPin.style.top = mainPinParams.initialY + 'px';
    mainPin.style.left = mainPinParams.initialX + 'px';
  };

  mainPin.addEventListener('mousedown', function (evt) {
    window.page.activate();
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var newCoords = {
        x: mainPin.offsetLeft - (startCoords.x - moveEvt.clientX),
        y: mainPin.offsetTop - (startCoords.y - moveEvt.clientY)
      };

      checkPinField(newCoords);

      mainPin.style.top = newCoords.y + 'px';
      mainPin.style.left = newCoords.x + 'px';

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.form.setAddress();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (window.util.isEnterPressed(evt)) {
      window.page.activate();
    }
  });

  window.mainPin = {
    getLocation: getLocation,
    reset: reset
  };
})();
