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
    minY: mapOverlay.offsetTop + map.minY - mainPinParams.height - mainPinParams.arrow,
    maxY: mapOverlay.offsetTop + map.maxY - mainPinParams.height - mainPinParams.arrow
  };

  /**
   * Объект с текущими координатами метки.
   *
   * @param {Integer} x
   * @param {Integer} y
   */
  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  /**
   * Ограничивает перемещение метки вне карты.
   *
   * @param {Object} coords
   */
  var checkForPinField = function (coords) {
    coords.x = Math.max(Math.min(coords.x, pinField.maxX), pinField.minX);
    coords.y = Math.max(Math.min(coords.y, pinField.maxY), pinField.minY);
  };

  /**
   * Текущая координата перетаскиваемой метки.
   *
   * @return {string}
   */
  var getLocation = function () {
    var x = Math.floor(mainPin.offsetLeft + mainPinParams.width / 2);
    var y = Math.floor(mainPin.offsetTop + mainPinParams.height / 2);
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

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var newCoords = new Coordinate(
          mainPin.offsetLeft - (startCoords.x - moveEvt.clientX),
          mainPin.offsetTop - (startCoords.y - moveEvt.clientY)
      );

      checkForPinField(newCoords);

      mainPin.style.top = newCoords.y + 'px';
      mainPin.style.left = newCoords.x + 'px';

      startCoords = new Coordinate(moveEvt.clientX, moveEvt.clientY);
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
