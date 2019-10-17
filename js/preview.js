'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var AVATAR_PREVIEW_IMAGE = document.querySelector('.ad-form-header__preview > img').src;
  var PHOTO_PREVIEW_SIZE = 70;

  var avatarChooser = document.querySelector('input[id="avatar"]');
  var avatarPreview = document.querySelector('.ad-form-header__preview > img');

  var photoContainer = document.querySelector('.ad-form__photo-container');
  var photoChooser = document.querySelector('input[id="images"]');

  var photoPreviewTemplate = document.querySelector('.ad-form__photo');
  var imagePreviewTemplate = document.createElement('img');

  imagePreviewTemplate.width = PHOTO_PREVIEW_SIZE;
  imagePreviewTemplate.height = PHOTO_PREVIEW_SIZE;

  var onFileChooserChange = function (evt) {
    var files = Array.prototype.slice.call(evt.target.files);

    if (evt.target === photoChooser) {
      while (photoContainer.children.length > 1) {
        photoContainer.removeChild(photoContainer.lastChild);
      }
    }

    files.forEach(function (file) {
      var fileName = file.name.toLowerCase();
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (evt.target.id === 'avatar') {
          avatarPreview.src = reader.result;
        } else {
          var image = imagePreviewTemplate.cloneNode();
          var photoPreview = photoPreviewTemplate.cloneNode();

          image.src = reader.result;
          photoPreview.appendChild(image);
          photoContainer.appendChild(photoPreview);
        }
      });

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        reader.readAsDataURL(file);
      }
    });
  };

  var reset = function () {
    avatarPreview.src = AVATAR_PREVIEW_IMAGE;

    while (photoContainer.children.length > 1) {
      photoContainer.removeChild(photoContainer.lastChild);
    }

    photoContainer.appendChild(photoPreviewTemplate);
  };

  avatarChooser.addEventListener('change', onFileChooserChange);
  photoChooser.addEventListener('change', onFileChooserChange);

  window.preview = {
    reset: reset
  };
})();
