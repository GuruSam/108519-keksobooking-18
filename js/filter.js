'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterElements = Array.prototype.slice.call(filterForm.children);
  var housingFeatures = filterForm.querySelectorAll('input');

  var priceMap = {
    'low': 10000,
    'high': 50000
  };

  var Filter = function () {};

  Filter.prototype.set = function (key, value) {
    key = key.split('-')[1];
    this[key] = value;
  };
  Filter.prototype.setFeatures = function (feature) {
    if (!this.features) {
      this.features = [];
    }
    this.features.push(feature);
  };

  /**
   * Фильтрует текущие объявления по типу жилья.
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
  var getFilterValues = function (elements) {
    var filter = new Filter();

    elements.forEach(function (el) {
      if (el.value !== 'any' && el.name !== 'features') {
        var value = (el.id === 'housing-rooms' || el.id === 'housing-guests') ? parseInt(el.value, 10) : el.value;
        filter.set(el.id, value);
      }

      if (el.name === 'features' && el.checked) {
        filter.setFeatures(el.value);
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
