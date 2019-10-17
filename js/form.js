'use strict';

(function () {
  var selectNodes = document.querySelectorAll('#room_number, #capacity, #type, #timein, #timeout');
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

  /**
   * Устанавливает координату метки в поле адрес.
   */
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
    var roomCapacity = capacityPattern[roomSelect.value];
    var errorMessage = roomCapacity.includes(guestCapacity.value) ? '' : 'Количество комнат не подходит ' + guestCapacity.textContent;

    capacitySelect.setCustomValidity(errorMessage);
  };

  /**
   * Установка минимальной цены по типу жилья.
   */
  var checkPrice = function () {
    var priceInput = document.querySelector('#price');
    var typeValue = document.querySelector('#type > option:checked').value;

    priceInput.setAttribute('min', priceMap[typeValue]);
    priceInput.placeholder = priceMap[typeValue];
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
   *
   * @param {Element} form
   */
  var toggleFormState = function (form) {
    var formNodes = form.querySelectorAll('fieldset, select');

    formNodes.forEach(function (node) {
      if (node.hasAttribute('disabled')) {
        node.removeAttribute('disabled');
      } else {
        form.reset();
        node.setAttribute('disabled', '');
      }
    });

    if (form.classList.contains('ad-form')) {
      setAddress();
      window.preview.reset();
    }
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

  var onSaveSuccess = function () {
    window.popup.showSuccess();

    adForm.querySelector('.ad-form__submit').removeAttribute('disabled');
    window.page.deactivate();
  };

  var onSaveError = function () {
    window.popup.showError('Не удалось сохранить объявление');
    adForm.querySelector('.ad-form__submit').removeAttribute('disabled');
  };

  selectNodes.forEach(function (select) {
    select.addEventListener('change', onSelectChange);
  });

  adForm.querySelector('.ad-form__submit').addEventListener('click', function (evt) {
    evt.preventDefault();
    adForm.checkValidity();

    if (adForm.reportValidity()) {
      window.backend.request(onSaveSuccess, onSaveError, new FormData(adForm));
      document.querySelector('.ad-form__submit').setAttribute('disabled', '');
    }
  });

  adForm.querySelector('.ad-form__reset').addEventListener('click', function (evt) {
    evt.preventDefault();
    window.page.deactivate();
  });

  checkPrice();

  window.form = {
    setAddress: setAddress,
    toggleFormState: toggleFormState
  };
})();
