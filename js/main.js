'use strict';

var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;

var MAP = {
  width: 1200,
  minY: 130,
  maxY: 630,
  offerAmount: 8,
  pin: {
    width: 50,
    height: 70
  },
  selfPin: {
    width: 65,
    height: 65,
    arrow: 15
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
var pageActive = false;

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

var renderCard = function (offer, params) {
  var fragment = document.createDocumentFragment();
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);

  fragment.appendChild(createCard(cardElement, offer, params));
  document.querySelector('.map').insertBefore(fragment, document.querySelector('.map__filters-container'));

  cardElement.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
  document.addEventListener('keydown', onPopupEscPress);
};

var removeCard = function (card) {
  card.remove();
  card.querySelector('.popup__close').removeEventListener('click', onPopupCloseClick);
  document.removeEventListener('keydown', onPopupEscPress);
};

var renderPin = function (ad, template, params) {
  var pinElement = template.cloneNode(true);

  pinElement.style = getPinLocation(ad.location, params);
  pinElement.querySelector('img').src = ad.author.avatar;
  pinElement.querySelector('img').alt = ad.offer.title;

  return pinElement;
};

var renderPinList = function (offers, map) {
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinContainer = document.querySelector('.map__pins');

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderPin(offers[i], pinTemplate, map.pin));
  }

  document.querySelector('.map__pins').appendChild(fragment);
  pinContainer.addEventListener('click', onPinClick);
};

var getSelfPinLocation = function (pin, map) {
  var x = Math.floor(pin.offsetLeft + map.selfPin.width / 2 - 1);
  var y = Math.floor(pin.offsetTop + map.selfPin.height / 2);
  var mapElement = document.querySelector('.map');

  if (!mapElement.classList.contains('map--faded')) {
    y += Math.floor(map.selfPin.height / 2 + map.selfPin.arrow);
  }

  return x + ', ' + y;
};

var togglePageState = function (pageStatus) {
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');

  if (pageStatus) {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    pageActive = false;

    toggleFormsState(adForm);
  } else {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    pageActive = true;

    toggleFormsState(adForm);
    renderPinList(offers, MAP);
  }

  setAddress(document.querySelector('.map__pin--main'));
};

var toggleFormsState = function (form) {
  var formFields = document.querySelectorAll('fieldset, select');

  if (form.classList.contains('ad-form--disabled')) {
    for (var i = 0; i < formFields.length; i++) {
      formFields[i].setAttribute('disabled', '');
    }
  } else {
    for (var j = 0; j < formFields.length; j++) {
      formFields[j].removeAttribute('disabled');
    }
  }
};

var setAddress = function (pin) {
  var address = getSelfPinLocation(pin, MAP);
  document.querySelector('input[name="address"]').value = address;
};

var checkCapacity = function () {
  var capacityPattern = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };
  var roomSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');

  var guestCapacity = capacitySelect.querySelector('option:checked');
  var roomCapacity = capacityPattern[roomSelect.querySelector('option:checked').value];
  var errorMessage = roomCapacity.includes(guestCapacity.value) ? '' : 'Количество комнат не подходит ' + guestCapacity.textContent;

  capacitySelect.setCustomValidity(errorMessage);
};

var checkPrice = function () {
  var priceMap = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var priceInput = document.querySelector('#price');
  var type = document.querySelector('#type > option:checked').value;

  priceInput.setAttribute('min', priceMap[type]);
  priceInput.placeholder = priceMap[type];
};

var checkTimes = function (select) {
  var timeInSelect = document.querySelector('#timein');
  var timeOutSelect = document.querySelector('#timeout');

  timeInSelect.value = select.value;
  timeOutSelect.value = select.value;
};

var onSelectChange = function (evt) {
  if (evt.target.id === 'room_number' || evt.target.id === 'capacity') {
    checkCapacity();
  }
  if (evt.target.id === 'type') {
    checkPrice();
  }
  if (evt.target.id === 'timein' || evt.target.id === 'timeout') {
    checkTimes(evt.target);
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
    removeCard(cardElement);
  }

  if (evt.target.matches('.map__pin[type="button"]')) {
    renderCard(offers[arr.indexOf(evt.target)], offerParams);
  }
  if (evt.target.matches('.map__pin[type="button"] > img')) {
    renderCard(offers[arr.indexOf(evt.target.parentNode)], offerParams);
  }
};

var onPopupCloseClick = function (evt) {
  var cardElement = evt.target.parentNode;
  removeCard(cardElement);
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    var cardElement = document.querySelector('.map > .map__card');
    removeCard(cardElement);
  }
};

var pin = document.querySelector('.map__pin--main');
var selectElements = document.querySelectorAll('#room_number, #capacity, #type, #timein, #timeout');

for (var i = 0; i < selectElements.length; i++) {
  selectElements[i].addEventListener('change', onSelectChange);
}

var offers = genOffers(offerParams, MAP);

pin.addEventListener('mousedown', function () {
  if (!pageActive) {
    togglePageState();
  }
});
pin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE && !pageActive) {
    togglePageState();
  }
});

toggleFormsState(document.querySelector('.ad-form'));
setAddress(pin);
