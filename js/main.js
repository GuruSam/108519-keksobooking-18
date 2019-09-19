'use strict';

var MAP_WIDTH = 1200;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var OFFER_AMOUNT = 8;

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

var randomArrayItem = function (arr) {
  var i = Math.floor(Math.random() * arr.length);
  return arr[i];
};

var getRandomArray = function (arr) {
  var length = getRandomNumber(1, arr.length);
  var features = [];

  for (var i = 0; i < length; i++) {
    features.push(arr[i]);
  }

  return features;
};

var genOffers = function (total, obj, width, min, max) {
  var offers = [];

  for (var i = 1; i <= total; i++) {
    var ad = {};

    ad.author = {};
    ad.offer = {};
    ad.location = {};

    ad.location.x = getRandomNumber(1, width);
    ad.location.y = getRandomNumber(min, max);

    ad.author.avatar = 'img/avatars/user0' + i + '.png';

    ad.offer.title = randomArrayItem(obj.titles);
    ad.offer.address = ad.location.x + ', ' + ad.location.y;
    ad.offer.price = obj.price;
    ad.offer.type = randomArrayItem(obj.types);
    ad.offer.rooms = getRandomNumber(1, obj.rooms);
    ad.offer.guests = getRandomNumber(1, obj.guests);
    ad.offer.checkin = randomArrayItem(obj.checkTimes);
    ad.offer.checkout = randomArrayItem(obj.checkTimes);
    ad.offer.features = getRandomArray(obj.features);
    ad.offer.description = obj.description;
    ad.offer.photos = getRandomArray(obj.photos);

    offers.push(ad);
  }

  return offers;
};

document.querySelector('.map').classList.remove('map--faded');
