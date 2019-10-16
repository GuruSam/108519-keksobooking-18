'use strict';

(function () {
  /**
   * Словарь типов жилья.
   */
  var offerTypesMap = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };

  var setCapacity = function (rooms, guests) {
    var roomDesc = rooms === 1 ? ' комната' : ' комнаты';
    var guestDesc = guests === 1 ? ' гостя' : ' гостей';

    return rooms + roomDesc + ' для ' + guests + guestDesc;
  };

  /**
   * Составляет список удобств.
   *
   * @param {Array} features
   * @param {Element} cardPopup
   */
  var setFeatures = function (features, cardPopup) {
    var featuresNode = cardPopup.querySelector('.popup__features');
    var fragment = document.createDocumentFragment();

    if (features) {
      features.forEach(function (feature) {
        var li = document.createElement('li');
        li.className = 'popup__feature popup__feature--' + feature;
        fragment.appendChild(li);
      });

      featuresNode.innerHTML = '';
      featuresNode.appendChild(fragment);
    } else {
      featuresNode.remove();
    }
  };

  /**
   * Составляет список фотографий.
   *
   * @param {Array} photos
   * @param {Element} cardPopup
   */
  var setPhotos = function (photos, cardPopup) {
    var photosNode = cardPopup.querySelector('.popup__photos');
    var imgTemplate = cardPopup.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();

    if (photos) {
      photos.forEach(function (photo) {
        var img = imgTemplate.cloneNode();
        img.src = photo;
        fragment.appendChild(img);
      });

      photosNode.innerHTML = '';
      photosNode.appendChild(fragment);
    } else {
      photosNode.remove();
    }
  };

  /**
   * Заполняет карточку объявления данными.
   *
   * @param {Element} cardPopup
   * @param {Object} ad
   * @return {Element}
   */
  var createCard = function (cardPopup, ad) {
    var cardNodes = cardPopup.querySelectorAll('p, h3, h4');

    cardPopup.querySelector('.popup__avatar').src =
      ad.author.avatar ? ad.author.avatar : '';
    cardPopup.querySelector('.popup__title').textContent =
      ad.offer.title ? ad.offer.title : '';
    cardPopup.querySelector('.popup__text--address').textContent =
      ad.offer.address ? ad.offer.address : '';
    cardPopup.querySelector('.popup__text--price').textContent =
      ad.offer.price ? ad.offer.price + ' ₽/ночь' : '';
    cardPopup.querySelector('.popup__type').textContent =
      ad.offer.type ? offerTypesMap[ad.offer.type] : '';
    cardPopup.querySelector('.popup__text--capacity').textContent =
      (ad.offer.rooms && ad.offer.guests) ? setCapacity(ad.offer.rooms, ad.offer.guests) : '';
    cardPopup.querySelector('.popup__text--time').textContent =
      (ad.offer.checkin && ad.offer.checkout) ? 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout : '';
    cardPopup.querySelector('.popup__description').textContent =
      ad.offer.description ? ad.offer.description : '';

    setFeatures(ad.offer.features, cardPopup);
    setPhotos(ad.offer.photos, cardPopup);

    cardNodes.forEach(function (field) {
      if (!field.textContent) {
        field.remove();
      }
    });

    if (!cardPopup.querySelector('.popup__avatar').src) {
      cardPopup.querySelector('.popup__avatar').remove();
    }

    return cardPopup;
  };

  /**
   * Отрисовывает карточку объявления.
   *
   * @param {Object} offer
   */
  var renderCard = function (offer) {
    var fragment = document.createDocumentFragment();
    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var cardPopup = cardTemplate.cloneNode(true);

    fragment.appendChild(createCard(cardPopup, offer));
    document.querySelector('.map').insertBefore(fragment, document.querySelector('.map__filters-container'));

    cardPopup.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);
  };

  /**
   * Удаляет карточку объявления.
   */
  var removeCard = function () {
    var cardPopup = document.querySelector('.map > .map__card');

    if (cardPopup) {
      cardPopup.remove();
      cardPopup.querySelector('.popup__close').removeEventListener('click', onPopupCloseClick);
    }

    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupCloseClick = function (evt) {
    var cardPopup = evt.target.parentNode;
    removeCard(cardPopup);
  };

  var onPopupEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      var cardPopup = document.querySelector('.map > .map__card');
      removeCard(cardPopup);
    }
  };

  window.card = {
    render: renderCard,
    remove: removeCard
  };
})();
