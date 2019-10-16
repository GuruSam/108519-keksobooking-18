'use strict';

(function () {
  /**
   * Параметры карты.
   */
  var Map = {
    WIDTH: 1200,
    MIN_Y: 130,
    MAX_Y: 630,
  };

  /**
   * Параметры перетаскиваемой метки.
   */
  var MainPinParams = {
    WIDTH: 65,
    HEIGHT: 65,
    ARROW: 1,
    INITIAL_X: 570,
    INITIAL_Y: 375
  };

  var mapOverlay = document.querySelector('.map__overlay');

  /**
   * Доступное поле для перемещения метки.
   */
  var PinField = {
    MIN_X: mapOverlay.offsetLeft - MainPinParams.WIDTH / 2,
    MAX_X: mapOverlay.offsetLeft + Map.WIDTH - MainPinParams.WIDTH / 2,
    MIN_Y: mapOverlay.offsetTop + Map.MIN_Y - MainPinParams.HEIGHT - MainPinParams.ARROW,
    MAX_Y: mapOverlay.offsetTop + Map.MAX_Y - MainPinParams.HEIGHT - MainPinParams.ARROW
  };

  var mainPinButton = document.querySelector('.map__pin--main');

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
    coords.x = Math.max(Math.min(coords.x, PinField.MAX_X), PinField.MIN_X);
    coords.y = Math.max(Math.min(coords.y, PinField.MAX_Y), PinField.MIN_Y);
  };

  /**
   * Текущая координата перетаскиваемой метки.
   *
   * @return {string}
   */
  var getLocation = function () {
    var x = Math.floor(mainPinButton.offsetLeft + MainPinParams.WIDTH / 2);
    var y = Math.floor(mainPinButton.offsetTop + MainPinParams.HEIGHT / 2);
    var mapSection = document.querySelector('.map');

    if (!mapSection.classList.contains('map--faded')) {
      y += Math.floor(MainPinParams.HEIGHT / 2 + MainPinParams.ARROW);
    }

    return x + ', ' + y;
  };

  /**
   * Сбрасывает метку в первоначальное состояние.
   */
  var reset = function () {
    mainPinButton.style.top = MainPinParams.INITIAL_Y + 'px';
    mainPinButton.style.left = MainPinParams.INITIAL_X + 'px';
  };

  mainPinButton.addEventListener('mousedown', function (evt) {
    window.page.activate();
    evt.preventDefault();

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.form.setAddress();

      var newCoords = new Coordinate(
          mainPinButton.offsetLeft - (startCoords.x - moveEvt.clientX),
          mainPinButton.offsetTop - (startCoords.y - moveEvt.clientY)
      );

      checkForPinField(newCoords);

      mainPinButton.style.top = newCoords.y + 'px';
      mainPinButton.style.left = newCoords.x + 'px';

      startCoords = new Coordinate(moveEvt.clientX, moveEvt.clientY);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mainPinButton.addEventListener('keydown', function (evt) {
    if (window.util.isEnterPressed(evt)) {
      window.page.activate();
    }
  });

  window.mainPin = {
    getLocation: getLocation,
    reset: reset
  };
})();
