'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterElements = Array.prototype.slice.call(filterForm.children);

  /**
   * Фильтрует текущие объявления по типу жилья.
   *
   * @return {Array}
   */
  var filterOffers = function () {
    var typeOptions = filterForm.querySelector('#housing-type').options;
    var checkedType = typeOptions[typeOptions.selectedIndex].value;
    var offers = window.offers.slice();

    return offers.filter(function (offer) {
      return offer.offer.type === checkedType;
    });
  };

  var onFilterChange = function () {
    var filtered = filterOffers();
    window.pin.renderList(filtered);
  };

  filterElements.forEach(function (el) {
    el.addEventListener('change', onFilterChange);
  });
})();
