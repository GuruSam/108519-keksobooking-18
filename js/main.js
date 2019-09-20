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
  types: ['palace', 'flat', 'house', 'bungalo'],
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
    ad.offer.type = getRandomArrayItem(obj.types);
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

var renderPin = function (obj, pinParams) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style = getPinLocation(obj.location, pinParams);
  pinElement.querySelector('img').src = obj.author.avatar;
  pinElement.querySelector('img').alt = obj.offer.title;

  return pinElement;
};

var renderPinList = function (offers, map) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderPin(offers[i], map.pin));
  }

  document.querySelector('.map__pins').appendChild(fragment);
};

document.querySelector('.map').classList.remove('map--faded');
var offers = genOffers(offerParams, MAP);

renderPinList(offers, MAP);
