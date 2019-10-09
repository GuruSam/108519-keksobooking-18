'use strict';

(function () {
  /**
   * Параметры метки объявления.
   */
  var pinParams = {
    width: 50,
    height: 70
  };

  var getPinLocation = function (location) {
    var x = location.x - pinParams.width / 2 - 1;
    var y = location.y - pinParams.height;
    return 'left: ' + x + 'px; top: ' + y + 'px';
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

  var removePinList = function () {
    var pinContainer = document.querySelector('.map__pins');
    pinContainer.removeEventListener('click', onPinClick);

    while (pinContainer.children.length > 2) {
      pinContainer.removeChild(pinContainer.lastChild);
    }
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

  window.pin = {
    renderList: renderPinList,
    removeList: removePinList
  };
})();
