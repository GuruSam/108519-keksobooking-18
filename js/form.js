'use strict';

(function () {
  var selectElements = document.querySelectorAll('#room_number, #capacity, #type, #timein, #timeout');
  var adForm = document.querySelector('.ad-form');

  /**
   * Соответствие количества комнат количеству гостей.
   */
  var capacityPattern = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  /**
   * Минимальная цена по типу жилья.
   */
  var priceMap = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };

  var onSelectChange = function (evt) {
    switch (evt.target.id) {
      case 'room_number':
      case 'capacity':
        checkCapacity();
        break;
      case 'type':
        checkPrice();
        break;
      case 'timein':
      case 'timeout':
        checkTimes(evt.target);
        break;
    }
  };

  var setAddress = function () {
    var address = window.mainPin.getLocation();
    document.querySelector('input[name="address"]').value = address;
  };

  /**
   * Проверка соответствия количества комнат количеству гостей.
   */
  var checkCapacity = function () {
    var roomSelect = document.querySelector('#room_number');
    var capacitySelect = document.querySelector('#capacity');

    var guestCapacity = capacitySelect.querySelector('option:checked');
    var roomCapacity = capacityPattern[roomSelect.querySelector('option:checked').value];
    var errorMessage = roomCapacity.includes(guestCapacity.value) ? '' : 'Количество комнат не подходит ' + guestCapacity.textContent;

    capacitySelect.setCustomValidity(errorMessage);
  };

  /**
   * Установка минимальной цены по типу жилья.
   */
  var checkPrice = function () {
    var priceInput = document.querySelector('#price');
    var type = document.querySelector('#type > option:checked').value;

    priceInput.setAttribute('min', priceMap[type]);
    priceInput.placeholder = priceMap[type];
  };

  /**
   * Установка времени заезда/выезда.
   *
   * @param {Element} select
   */
  var checkTimes = function (select) {
    document.querySelector('#timein').value = select.value;
    document.querySelector('#timeout').value = select.value;
  };

  /**
   * Изменение состояния формы.
   */
  var toggleFormsState = function () {
    var formFields = document.querySelectorAll('fieldset, select');
    setAddress();

    if (adForm.classList.contains('ad-form--disabled')) {
      formFields.forEach(function (field) {
        field.setAttribute('disabled', '');
      });
    } else {
      formFields.forEach(function (field) {
        field.removeAttribute('disabled');
      });
    }
  };

  var resetForm = function (form) {
    form.reset();
    setAddress();
  };

  selectElements.forEach(function (el) {
    el.addEventListener('change', onSelectChange);
  });

  adForm.querySelector('.ad-form__submit').addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.checkValidity();

    if (adForm.reportValidity()) {
      window.backend.save(new FormData(adForm));
      document.querySelector('.ad-form__submit').setAttribute('disabled', '');
    }
  });

  adForm.querySelector('.ad-form__reset').addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.reset();
    window.page.deactivate();
  });

  window.form = {
    setAddress: setAddress,
    toggleFormsState: toggleFormsState,
    reset: resetForm
  };
})();
