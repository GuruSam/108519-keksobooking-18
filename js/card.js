'use strict';

(function () {
  var offerTypes = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };

  var getCapacity = function (rooms, guests) {
    var roomDesc = rooms === 1 ? ' комната' : ' комнаты';
    var guestDesc = guests === 1 ? ' гостя' : ' гостей';

    return rooms + roomDesc + ' для ' + guests + guestDesc;
  };

  var getFeatures = function (features, cardElement) {
    var featuresList = cardElement.querySelector('.popup__features');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < features.length; i++) {
      var feature = document.createElement('li');
      feature.className = 'popup__feature popup__feature--' + features[i];
      fragment.appendChild(feature);
    }

    featuresList.innerHTML = '';
    featuresList.appendChild(fragment);
  };

  var getPhotos = function (photos, cardElement) {
    var photosList = cardElement.querySelector('.popup__photos');
    var imgTemplate = cardElement.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      var photo = imgTemplate.cloneNode();
      photo.src = photos[i];
      fragment.appendChild(photo);
    }

    photosList.innerHTML = '';
    photosList.appendChild(fragment);
  };

  var createCard = function (cardElement, ad) {
    cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
    cardElement.querySelector('.popup__title').textContent = ad.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
    cardElement.querySelector('.popup__type').textContent = offerTypes[ad.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = getCapacity(ad.offer.rooms, ad.offer.guests);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = ad.offer.description;

    getFeatures(ad.offer.features, cardElement);
    getPhotos(ad.offer.photos, cardElement);

    return cardElement;
  };

  var renderCard = function (offer) {
    var fragment = document.createDocumentFragment();
    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var cardElement = cardTemplate.cloneNode(true);

    fragment.appendChild(createCard(cardElement, offer));
    document.querySelector('.map').insertBefore(fragment, document.querySelector('.map__filters-container'));

    cardElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var removeCard = function () {
    var cardElement = document.querySelector('.map > .map__card');

    if (cardElement) {
      cardElement.remove();
      cardElement.querySelector('.popup__close').removeEventListener('click', onPopupCloseClick);
    }

    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupCloseClick = function (evt) {
    var cardElement = evt.target.parentNode;
    removeCard(cardElement);
  };

  var onPopupEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      var cardElement = document.querySelector('.map > .map__card');
      removeCard(cardElement);
    }
  };

  window.card = {
    render: renderCard,
    remove: removeCard
  };
})();
