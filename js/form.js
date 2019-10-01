'use strict';

(function () {
  var selectElements = document.querySelectorAll('#room_number, #capacity, #type, #timein, #timeout');

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

  var setAddress = function () {
    var address = window.pin.getMainPinLocation();
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

  var toggleFormsState = function () {
    var form = document.querySelector('.ad-form');
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

  for (var i = 0; i < selectElements.length; i++) {
    selectElements[i].addEventListener('change', onSelectChange);
  }

  window.addEventListener('load', function () {
    toggleFormsState();
    setAddress();
  });

  window.form = {
    setAddress: setAddress,
    toggleFormsState: toggleFormsState
  };
})();
