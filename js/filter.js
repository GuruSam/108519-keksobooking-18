'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterElements = Array.prototype.slice.call(filterForm.children);
  var housingFeatures = filterForm.querySelectorAll('input');

  var priceMap = {
    'low': 10000,
    'high': 50000
  };

  /**
   * Фильтрует текущие объявления по типу жилья.
   *
   * @return {Array}
   */
  var filterOffers = function () {
    var offers = window.offers.slice();
    var filterValues = getFilterValues();

    for (var key in filterValues) {
      if (filterValues.hasOwnProperty(key)) {

        offers = offers.filter(function (offer) {
          return compareValues(key, filterValues[key], offer);
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
  var getFilterValues = function () {
    var filter = {};

    filterElements.forEach(function (el) {
      if (el.value !== 'any' && el.name !== 'features') {
        var value = (el.id === 'housing-rooms' || el.id === 'housing-guests') ? parseInt(el.value, 10) : el.value;
        filter[el.id.split('-')[1]] = value;
      }

      if (el.name === 'features' && el.checked) {
        if (!filter.features) {
          filter.features = [];
        }
        filter.features.push(el.value);
      }
    });

    return filter;
  };

  /**
   * Сравнивает значение фильтра с соответствующим значением объявления.
   *
   * @param {*} key
   * @param {*} value
   * @param {Object} offer
   * @return {Boolean}
   */
  var compareValues = function (key, value, offer) {
    if (Array.isArray(value)) {
      return value.every(function (feature) {
        return offer.offer.features.includes(feature);
      });
    }

    if (key === 'price') {
      return value === getPriceLevel(offer.offer.price);
    }

    return value === offer.offer[key];
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
