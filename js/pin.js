'use strict';

(function () {
  /**
   * Максимальное количество объявлений на карте.
   */
  var MAX_PIN_AMOUNT = 5;

  /**
   * Параметры метки объявления.
   */
  var pinParams = {
    width: 50,
    height: 70
  };

  var pinContainer = document.querySelector('.map__pins');
  var filteredOffers;

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

  var renderPinList = function (offers) {
    filteredOffers = offers.slice(0, MAX_PIN_AMOUNT);
    var fragment = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

    if (pinContainer.children.length > 2) {
      removePinList();
    }

    filteredOffers.forEach(function (offer) {
      fragment.appendChild(renderPin(offer, pinTemplate));
    });

    document.querySelector('.map__pins').appendChild(fragment);
    pinContainer.addEventListener('click', onPinClick);
  };

  var removePinList = function () {
    pinContainer.removeEventListener('click', onPinClick);

    while (pinContainer.children.length > 2) {
      pinContainer.removeChild(pinContainer.lastChild);
    }

    window.card.remove();
  };

  var onPinClick = function (evt) {
    var pinElements = pinContainer.querySelectorAll('.map__pin[type="button"]');
    var pins = Array.prototype.slice.call(pinElements);

    window.card.remove();

    if (evt.target.matches('.map__pin[type="button"]')) {
      window.card.render(filteredOffers[pins.indexOf(evt.target)]);
    }
    if (evt.target.matches('.map__pin[type="button"] > img')) {
      window.card.render(filteredOffers[pins.indexOf(evt.target.parentNode)]);
    }
  };

  window.pin = {
    renderList: renderPinList,
    removeList: removePinList
  };
})();
