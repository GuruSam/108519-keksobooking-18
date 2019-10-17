'use strict';

(function () {
  var DEBOUNCE_TIME = 500;

  var filterForm = document.querySelector('.map__filters');
  var filterNodes = Array.prototype.slice.call(filterForm.children);
  var housingFeaturesNodes = filterForm.querySelectorAll('input');

  var priceMap = {
    'low': 10000,
    'high': 50000
  };

  /**
   * Фильтрует текущие объявления.
   *
   * @return {Array}
   */
  var filterOffers = function () {
    var offers = window.offers.slice();
    var filterValues = getFilterValues();
    var features = getSelectedFeatures();

    for (var key in filterValues) {
      if (filterValues.hasOwnProperty(key)) {

        offers = offers.filter(function (offer) {
          if (key === 'price') {
            return filterValues[key] === getPriceLevel(offer.offer.price);
          }
          return filterValues[key] === offer.offer[key];
        });

      }
    }

    offers = offers.filter(function (offer) {
      return features.every(function (feature) {
        return offer.offer.features.includes(feature);
      });
    });

    return offers;
  };

  /**
   * Конвертирует цену в уровень.
   *
   * @param {Integer} price
   * @return {String}
   */
  var getPriceLevel = function (price) {
    var priceLevel = price < priceMap.low ? 'low' : 'middle';

    if (price >= priceMap.high) {
      priceLevel = 'high';
    }

    return priceLevel;
  };

  /**
   * Получает выбранные фильтры.
   *
   * @param {Array} elements
   * @return {Array}
   */
  var getFilterValues = function () {
    var filter = {};

    filterNodes.forEach(function (el) {
      if (el.value !== 'any') {
        filter[el.id.split('-')[1]] = (el.id === 'housing-rooms' || el.id === 'housing-guests') ? parseInt(el.value, 10) : el.value;
      }
    });

    return filter;
  };

  var getSelectedFeatures = function () {
    var features = [];

    housingFeaturesNodes.forEach(function (feature) {
      if (feature.checked) {
        features.push(feature.value);
      }
    });

    return features;
  };

  // Устранение дребезга
  var lastTimeout;

  var onFilterChange = function () {
    var filtered = filterOffers();

    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    lastTimeout = setTimeout(function () {
      window.pin.renderList(filtered);
    }, DEBOUNCE_TIME);
  };

  filterNodes.pop();

  filterNodes.forEach(function (el) {
    el.addEventListener('change', onFilterChange);
  });

  housingFeaturesNodes.forEach(function (feature) {
    feature.addEventListener('change', onFilterChange);
  });
})();
