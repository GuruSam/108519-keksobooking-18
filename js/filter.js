'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterElements = Array.prototype.slice.call(filterForm.children);
  var housingFeatures = Array.prototype.slice.call(filterForm.querySelectorAll('input'));

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
    var filterValues = getFilterValues(filterElements);

    for (var key in filterValues) {
      if (filterValues.hasOwnProperty(key)) {

        offers = offers.filter(function (offer) {
          if (key === 'price') {
            return filterValues[key] === getPriceLevel(offer.offer.price);
          }
          if (key === 'features') {
            return compareFeatures(filterValues[key], offer.offer.features);
          }
          return offer.offer[key] === filterValues[key];
        });

      }
    }
    return offers;
  };

  /**
   * Конвертирует цену в уровень.
   *
   * @param {Integer} price
   * @return {String}
   */
  var getPriceLevel = function (price) {
    var priceLevel;

    if (price < priceMap.low) {
      priceLevel = 'low';
    } else if (price >= priceMap.high) {
      priceLevel = 'high';
    } else {
      priceLevel = 'middle';
    }

    return priceLevel;
  };

  /**
   * Получает выбранные фильтры.
   *
   * @param {Array} elements
   * @return {Array}
   */
  var getFilterValues = function (elements) {
    var filter = {};

    elements.forEach(function (el) {
      if (el.value !== 'any' && el.tagName !== 'INPUT') {
        var value = (el.id === 'housing-rooms' || el.id === 'housing-guests') ? parseInt(el.value, 10) : el.value;
        filter[el.id.split('-')[1]] = value;
      }

      if (el.tagName === 'INPUT' && el.checked) {
        if (!filter.features) {
          filter.features = [];
        }
        filter.features.push(el.value);
      }
    });

    return filter;
  };

  /**
   * Сравнивает два массива.
   *
   * @param {Array} a
   * @param {Array} b
   * @return {Boolean}
   */
  var compareFeatures = function (a, b) {
    return a.every(function (feature) {
      return b.includes(feature);
    });
  };

  var onFilterChange = function () {
    var filtered = filterOffers();
    window.pin.renderList(filtered);
  };

  housingFeatures.forEach(function (feature) {
    filterElements.push(feature);
  });

  filterElements.splice(4, 1);

  filterElements.forEach(function (el) {
    el.addEventListener('change', onFilterChange);
  });
})();
