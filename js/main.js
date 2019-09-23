'use strict';

var MAP = {
  width: 1200,
  minY: 130,
  maxY: 630,
  offerAmount: 8,
  pin: {
    width: 50,
    height: 70
  }
};

var offerParams = {
  types: {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  },
  checkTimes: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  titles: ['Сдам', 'Продам', 'Подарю'],
  description: 'Описание',
  price: 1000,
  rooms: 4,
  guests: 4,
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * ((max + 1) - min) + min);
};

var getRandomArrayItem = function (arr) {
  var i = Math.floor(Math.random() * arr.length);
  return arr[i];
};

var getRandomArray = function (arr) {
  var length = getRandomNumber(1, arr.length);
  var array = [];

  for (var i = 0; i < length; i++) {
    array.push(arr[i]);
  }

  return array;
};

var genOffers = function (obj, map) {
  var offers = [];

  for (var i = 1; i <= map.offerAmount; i++) {
    var ad = {};

    ad.author = {};
    ad.offer = {};
    ad.location = {};

    ad.location.x = getRandomNumber(1, map.width);
    ad.location.y = getRandomNumber(map.minY, map.maxY);

    ad.author.avatar = 'img/avatars/user0' + i + '.png';

    ad.offer.title = getRandomArrayItem(obj.titles);
    ad.offer.address = ad.location.x + ', ' + ad.location.y;
    ad.offer.price = obj.price;
    ad.offer.type = getRandomArrayItem(Object.keys(obj.types));
    ad.offer.rooms = getRandomNumber(1, obj.rooms);
    ad.offer.guests = getRandomNumber(1, obj.guests);
    ad.offer.checkin = getRandomArrayItem(obj.checkTimes);
    ad.offer.checkout = getRandomArrayItem(obj.checkTimes);
    ad.offer.features = getRandomArray(obj.features);
    ad.offer.description = obj.description;
    ad.offer.photos = getRandomArray(obj.photos);

    offers.push(ad);
  }

  return offers;
};

var getPinLocation = function (location, pin) {
  var x = location.x - pin.width / 2 - 1;
  var y = location.y - pin.height;
  return 'left: ' + x + 'px; top: ' + y + 'px';
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

var renderPin = function (obj, template, params) {
  var pinElement = template.cloneNode(true);

  pinElement.style = getPinLocation(obj.location, params);
  pinElement.querySelector('img').src = obj.author.avatar;
  pinElement.querySelector('img').alt = obj.offer.title;

  return pinElement;
};

var renderPinList = function (offers, map) {
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderPin(offers[i], pinTemplate, map.pin));
  }

  document.querySelector('.map__pins').appendChild(fragment);
};

var createCard = function (cardElement, ad, params) {
  cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
  cardElement.querySelector('.popup__title').textContent = ad.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = params.types[ad.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = getCapacity(ad.offer.rooms, ad.offer.guests);
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = ad.offer.description;

  getFeatures(ad.offer.features, cardElement);
  getPhotos(ad.offer.photos, cardElement);

  return cardElement;
};

var renderCard = function (offers, params) {
  var fragment = document.createDocumentFragment();
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);

  fragment.appendChild(createCard(cardElement, offers[0], params));
  document.querySelector('.map').insertBefore(fragment, document.querySelector('.map__filters-container'));
};

document.querySelector('.map').classList.remove('map--faded');
var offers = genOffers(offerParams, MAP);

renderPinList(offers, MAP);
renderCard(offers, offerParams);
