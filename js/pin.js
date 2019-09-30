'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');

  var getPinLocation = function (location) {
    var x = location.x - window.util.pin.width / 2 - 1;
    var y = location.y - window.util.pin.height;
    return 'left: ' + x + 'px; top: ' + y + 'px';
  };

  var getMainPinLocation = function () {
    var pin = document.querySelector('.map__pin--main');
    var x = Math.floor(pin.offsetLeft + window.util.selfPin.width / 2);
    var y = Math.floor(pin.offsetTop + window.util.selfPin.height / 2);
    var mapElement = document.querySelector('.map');

    if (!mapElement.classList.contains('map--faded')) {
      y += Math.floor(window.util.selfPin.height / 2 + window.util.selfPin.arrow);
    }

    return x + ', ' + y;
  };

  var renderPin = function (offer, template) {
    var pinElement = template.cloneNode(true);

    pinElement.style = getPinLocation(offer.location);
    pinElement.querySelector('img').src = offer.author.avatar;
    pinElement.querySelector('img').alt = offer.offer.title;

    return pinElement;
  };

  var renderPinList = function () {
    var fragment = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var pinContainer = document.querySelector('.map__pins');

    for (var i = 0; i < window.offers.length; i++) {
      fragment.appendChild(renderPin(window.offers[i], pinTemplate));
    }

    document.querySelector('.map__pins').appendChild(fragment);
    pinContainer.addEventListener('click', onPinClick);
  };

  var onPinClick = function (evt) {
    var pinButtons = document.querySelectorAll('.map__pin[type="button"]');
    var cardElement = document.querySelector('.map > .map__card');
    var arr = [];

    for (var i = 0; i < pinButtons.length; i++) {
      arr.push(pinButtons[i]);
    }

    if (cardElement) {
      window.card.remove(cardElement);
    }

    if (evt.target.matches('.map__pin[type="button"]')) {
      window.card.render(window.offers[arr.indexOf(evt.target)]);
    }
    if (evt.target.matches('.map__pin[type="button"] > img')) {
      window.card.render(window.offers[arr.indexOf(evt.target.parentNode)]);
    }
  };

  mainPin.addEventListener('mousedown', function (evt) {
    if (!window.pageActive) {
      window.util.togglePageState();
    }
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

      newCoords.x = newCoords.x < window.util.pinField.maxX ? newCoords.x : window.util.pinField.maxX;
      newCoords.x = newCoords.x > window.util.pinField.minX ? newCoords.x : window.util.pinField.minX;
      newCoords.y = newCoords.y < window.util.pinField.maxY ? newCoords.y : window.util.pinField.maxY;
      newCoords.y = newCoords.y > window.util.pinField.minY ? newCoords.y : window.util.pinField.minY;

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
    if (evt.keyCode === window.util.ENTER_KEYCODE && !window.pageActive) {
      window.util.togglePageState();
    }
  });

  window.pin = {
    getMainPinLocation: getMainPinLocation,
    renderList: renderPinList,
  };
})();
