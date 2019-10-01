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
    var x = Math.floor(pin.offsetLeft + window.util.selfPin.width / 2 - 1);
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

  mainPin.addEventListener('mousedown', function () {
    if (!window.pageActive) {
      window.togglePageState();
    }
  });
  mainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ENTER_KEYCODE && !window.pageActive) {
      window.togglePageState();
    }
  });

  window.pin = {
    getMainPinLocation: getMainPinLocation,
    renderList: renderPinList,
  };
})();
