'use strict';

(function () {
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

  var genOffers = function (offer, map) {
    var offers = [];

    for (var i = 1; i <= map.offerAmount; i++) {
      var ad = {};

      ad.author = {};
      ad.offer = {};
      ad.location = {};

      ad.location.x = window.util.getRandomNumber(1, map.width);
      ad.location.y = window.util.getRandomNumber(map.minY, map.maxY);

      ad.author.avatar = 'img/avatars/user0' + i + '.png';

      ad.offer.title = window.util.getRandomArrayItem(offer.titles);
      ad.offer.address = ad.location.x + ', ' + ad.location.y;
      ad.offer.price = offer.price;
      ad.offer.type = window.util.getRandomArrayItem(Object.keys(offer.types));
      ad.offer.rooms = window.util.getRandomNumber(1, offer.rooms);
      ad.offer.guests = window.util.getRandomNumber(1, offer.guests);
      ad.offer.checkin = window.util.getRandomArrayItem(offer.checkTimes);
      ad.offer.checkout = window.util.getRandomArrayItem(offer.checkTimes);
      ad.offer.features = window.util.getRandomArray(offer.features);
      ad.offer.description = offer.description;
      ad.offer.photos = window.util.getRandomArray(offer.photos);

      offers.push(ad);
    }

    return offers;
  };

  var offers = genOffers(offerParams, window.util.map);

  window.offers = offers;
  window.offerParams = offerParams;
})();

