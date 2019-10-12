'use strict';

(function () {
  /**
   * Максимальное количество объявлений на карте.
   */
  var MAX_PIN_AMOUNT = 5;

  var filterForm = document.querySelector('.map__filters');
  var filterElements = Array.prototype.slice.call(filterForm.children);

  /**
   * Фильтрует количество меток на карте.
   *
   * @param {Array} offers
   * @return {Array}
   */
  var maxPinFilter = function (offers) {
    if (offers.length > MAX_PIN_AMOUNT) {
      var filtered = [];

      for (var i = 0; i < MAX_PIN_AMOUNT; i++) {
        filtered.push(offers[i]);
      }

      return filtered;
    }

    return offers;
  };

  /**
   * Фильтрует текущие объявления по типу жилья.
   */
  var offerTypeFilter = function () {
    var typeOptions = filterForm.querySelector('#housing-type').options;
    var checkedType = typeOptions[typeOptions.selectedIndex].value;
    var offers = window.offers.slice();

    window.pin.renderList(
        offers.filter(function (offer) {
          return offer.offer.type === checkedType;
        })
    );
  };

  var onFilterChange = function (evt) {
    switch (evt.target.id) {
      case 'housing-type':
        offerTypeFilter();
        break;
    }
  };

  filterElements.forEach(function (el) {
    el.addEventListener('change', onFilterChange);
  });

  window.filter = {
    maxPin: maxPinFilter
  };
})();
