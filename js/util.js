'use strict';

(function () {
  window.util = {
    ENTER_KEYCODE: 13,
    ESC_KEYCODE: 27,
    isEscPressed: function (evt) {
      return evt.keyCode === window.util.ESC_KEYCODE;
    },
    isEnterPressed: function (evt) {
      return evt.keyCode === window.util.ENTER_KEYCODE;
    }
  };
})();

