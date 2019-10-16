'use strict';

(function () {
  /**
   * Максимальное количество объявлений на карте.
   */
  var MAX_PIN_AMOUNT = 5;

  /**
   * Параметры метки объявления.
   */
  var Pin = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var pinContainer = document.querySelector('.map__pins');
  var filteredOffers;

  /**
   * Устанавливает расположение метки на карте.
   *
   * @param {object} location
   * @return {String}
   */
  var getPinLocation = function (location) {
    var x = location.x - Pin.WIDTH / 2 - 1;
    var y = location.y - Pin.HEIGHT;
    return 'left: ' + x + 'px; top: ' + y + 'px';
  };

  /**
   * Отрисовывает метку.
   *
   * @param {Object} offer
   * @param {Element} template
   * @return {Element}
   */
  var renderPin = function (offer, template) {
    var pinButton = template.cloneNode(true);

    pinButton.style = getPinLocation(offer.location);
    pinButton.querySelector('img').src = offer.author.avatar;
    pinButton.querySelector('img').alt = offer.offer.title;

    return pinButton;
  };

  /**
   * Отрисовывает метки на карту.
   *
   * @param {Object} offers
   */
  var renderPinList = function (offers) {
    filteredOffers = offers.slice(0, MAX_PIN_AMOUNT);
    var fragment = document.createDocumentFragment();
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

    if (pinContainer.children.length > 2) {
      removePinList();
    }

    filteredOffers.forEach(function (offer) {
      if (offer.offer) {
        fragment.appendChild(renderPin(offer, pinTemplate));
      }
    });

    document.querySelector('.map__pins').appendChild(fragment);
    pinContainer.addEventListener('click', onPinClick);
  };

  /**
   * Очищает карту от меток.
   */
  var removePinList = function () {
    pinContainer.removeEventListener('click', onPinClick);

    while (pinContainer.children.length > 2) {
      pinContainer.removeChild(pinContainer.lastChild);
    }

    window.card.remove();
  };

  var onPinClick = function (evt) {
    var pinButtons = pinContainer.querySelectorAll('.map__pin[type="button"]');
    var pins = Array.prototype.slice.call(pinButtons);

    pins.forEach(function (pinButton) {
      if (pinButton.classList.contains('map__pin--active')) {
        pinButton.classList.remove('map__pin--active');
      }
    });

    window.card.remove();

    if (evt.target.matches('.map__pin[type="button"]')) {
      window.card.render(filteredOffers[pins.indexOf(evt.target)]);
      evt.target.classList.add('map__pin--active');
    }
    if (evt.target.matches('.map__pin[type="button"] > img')) {
      window.card.render(filteredOffers[pins.indexOf(evt.target.parentNode)]);
      evt.target.parentNode.classList.add('map__pin--active');
    }
  };

  window.pin = {
    renderList: renderPinList,
    removeList: removePinList
  };
})();
