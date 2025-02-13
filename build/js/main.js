"use strict";

//fade-in when visible
document.addEventListener("DOMContentLoaded", function () {
  var elements = document.querySelectorAll(".fade-in, .slideInLeft, .slideInRight, .fadeInFromTop");
  function checkVisibility() {
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", checkVisibility);
  checkVisibility();
});

//open form block
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector(".header__content-btn");
  var form = document.querySelector(".firstForm");
  btn.addEventListener("click", function () {
    if (form.style.display === "none" || form.style.display === "") {
      form.style.display = "block";
      btn.textContent = "Згорнути";
    } else {
      form.style.display = "none";
      btn.textContent = "Доєднатись";
    }
  });
});

//slider

document.addEventListener("DOMContentLoaded", function () {
  var sliderWrapper = document.querySelector(".slider__wrapper");
  var slides = document.querySelectorAll(".slider__slide");
  var prevBtn = document.querySelector(".slider__btn-prev");
  var nextBtn = document.querySelector(".slider__btn-next");
  var dotsContainer = document.querySelector(".slider__dots");
  var currentIndex = 0;
  var interval;
  function updateSlider() {
    slides.forEach(function (slide, index) {
      slide.style.display = index === currentIndex ? "flex" : "none";
    });
    document.querySelectorAll(".slider__dot").forEach(function (dot, index) {
      dot.classList.toggle("active", index === currentIndex);
    });
  }
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }
  function startAutoSlide() {
    interval = setInterval(nextSlide, 3000);
  }
  function stopAutoSlide() {
    clearInterval(interval);
  }
  slides.forEach(function (_, index) {
    var dot = document.createElement("span");
    dot.classList.add("slider__dot");
    dot.addEventListener("click", function () {
      currentIndex = index;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  });
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);
  updateSlider();
  startAutoSlide();
});

//form

document.addEventListener("DOMContentLoaded", function () {
  var forms = document.querySelectorAll('form'); // Все формы на странице

  forms.forEach(function (form) {
    var phoneInput = form.querySelector('.form__input-phone');
    var dateInput = form.querySelector('.form__input-date');
    var regionInput = form.querySelector('.form__input-region');
    var checkboxInput = form.querySelector('.form__input-checkbox');
    var radioInputs = form.querySelectorAll('input[name="yes-no"]'); // Для проверки военнослужащего
    var submitButton = form.querySelector('.form__submit');
    var allInputs = form.querySelectorAll('.form__input');
    var telegramInput = form.querySelector('.form__input-telegram'); // Нік в телеграмі
    var formWarning = form.querySelector('.form__warning'); // Контейнер для предупреждений

    // telephone
    phoneInput.addEventListener('focus', function () {
      if (phoneInput.value.trim() === '') {
        phoneInput.value = '+38'; // Автозаполнение при фокусе
      }
    });
    phoneInput.addEventListener('input', function () {
      var value = this.value.replace(/\D/g, '');
      if (value.length > 1) {
        value = '+38 ' + value.slice(2, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8, 10) + ' ' + value.slice(10, 12);
      } else {
        value = '+38';
      }
      this.value = value;
    });

    //input
    form.addEventListener('input', function (event) {
      var targetInput = event.target;
      if (targetInput.classList.contains('warning')) {
        validateSingleInput(targetInput);
      }
      var isAnyInputFilled = Array.from(allInputs).some(function (input) {
        return input.value.trim() !== "" || input.checked;
      });
      if (isAnyInputFilled) {
        submitButton.classList.add('active');
      } else {
        submitButton.classList.remove('active');
      }
    });

    // check 1 input
    function validateSingleInput(input) {
      if (input.type === "date" && input.value === "2000-01-01") {
        input.classList.add('warning');
      } else if (input.value.trim() === "" || input.classList.contains('form__input-phone') && !/^\+38\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2}$/.test(input.value)) {
        input.classList.add('warning');
      } else if (input.classList.contains('form__input-region') && input.value === "") {
        input.classList.add('warning');
      } else if (input.classList.contains('form__input-checkbox') && !input.checked) {
        input.classList.add('warning');
      } else if (input.classList.contains('form__input-radio')) {
        var isRadioChecked = Array.from(radioInputs).some(function (radio) {
          return radio.checked;
        });
        if (!isRadioChecked) {
          radioInputs.forEach(function (radio) {
            return radio.classList.add('warning');
          });
        } else {
          radioInputs.forEach(function (radio) {
            return radio.classList.remove('warning');
          });
        }
      } else {
        input.classList.remove('warning');
      }
    }

    // validation
    function validateInputs(form) {
      var isValid = true;
      var hasWarning = false;
      allInputs.forEach(function (input) {
        if (input === telegramInput) {
          return;
        }
        if (input.type === "date" && input.value === "2000-01-01") {
          input.classList.add('warning');
          hasWarning = true;
          isValid = false;
        } else if (input.value.trim() === "" || input.classList.contains('form__input-phone') && !/^\+38\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2}$/.test(input.value)) {
          input.classList.add('warning');
          hasWarning = true;
          isValid = false;
        } else if (input.classList.contains('form__input-region') && input.value === "") {
          input.classList.add('warning');
          hasWarning = true;
          isValid = false;
        } else if (input.classList.contains('form__input-checkbox') && !input.checked) {
          input.classList.add('warning');
          hasWarning = true;
          isValid = false;
        } else if (input.classList.contains('form__input-radio')) {
          var isRadioChecked = Array.from(radioInputs).some(function (radio) {
            return radio.checked;
          });
          if (!isRadioChecked) {
            radioInputs.forEach(function (radio) {
              return radio.classList.add('warning');
            });
            hasWarning = true;
            isValid = false;
          } else {
            radioInputs.forEach(function (radio) {
              return radio.classList.remove('warning');
            });
          }
        } else {
          input.classList.remove('warning');
        }
      });
      if (hasWarning) {
        formWarning.classList.add('visible');
      } else {
        formWarning.classList.remove('visible');
      }
      if (isValid) {
        submitButton.classList.remove('warning');
      } else {
        submitButton.classList.add('warning');
      }
    }

    //submit
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var isValid = true;
      validateInputs(form);
      if (form.querySelector('.warning')) {
        isValid = false;
      }
      if (isValid) {
        var _form$querySelector;
        var successMessage = form.querySelector('.form__success');
        var formData = {
          surname: form.querySelector(".form__input-surname").value.trim(),
          firstName: form.querySelector(".form__input-first-name").value.trim(),
          middleName: form.querySelector(".form__input-middle-name").value.trim(),
          phone: form.querySelector(".form__input-phone").value.trim(),
          birthDate: form.querySelector(".form__input-date").value,
          telegramNick: form.querySelector(".form__input-telegram").value.trim(),
          region: form.querySelector(".form__input-region").value,
          isMilitary: ((_form$querySelector = form.querySelector(".form__input-radio:checked")) === null || _form$querySelector === void 0 ? void 0 : _form$querySelector.value) || "no",
          consent: form.querySelector(".form__input-checkbox").checked
        };
        console.log("Form Data:", formData);
        if (successMessage) {
          successMessage.classList.add('visible');
          setTimeout(function () {
            successMessage.classList.remove('visible');
            form.reset();
          }, 5000);
          successMessage.addEventListener('click', function () {
            successMessage.classList.remove('visible');
            form.reset();
          });
        }
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2hlY2tWaXNpYmlsaXR5IiwiZm9yRWFjaCIsImVsIiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwiY2xhc3NMaXN0IiwiYWRkIiwiYnRuIiwicXVlcnlTZWxlY3RvciIsImZvcm0iLCJzdHlsZSIsImRpc3BsYXkiLCJ0ZXh0Q29udGVudCIsInNsaWRlcldyYXBwZXIiLCJzbGlkZXMiLCJwcmV2QnRuIiwibmV4dEJ0biIsImRvdHNDb250YWluZXIiLCJjdXJyZW50SW5kZXgiLCJpbnRlcnZhbCIsInVwZGF0ZVNsaWRlciIsInNsaWRlIiwiaW5kZXgiLCJkb3QiLCJ0b2dnbGUiLCJuZXh0U2xpZGUiLCJsZW5ndGgiLCJwcmV2U2xpZGUiLCJzdGFydEF1dG9TbGlkZSIsInNldEludGVydmFsIiwic3RvcEF1dG9TbGlkZSIsImNsZWFySW50ZXJ2YWwiLCJfIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiZm9ybXMiLCJwaG9uZUlucHV0IiwiZGF0ZUlucHV0IiwicmVnaW9uSW5wdXQiLCJjaGVja2JveElucHV0IiwicmFkaW9JbnB1dHMiLCJzdWJtaXRCdXR0b24iLCJhbGxJbnB1dHMiLCJ0ZWxlZ3JhbUlucHV0IiwiZm9ybVdhcm5pbmciLCJ2YWx1ZSIsInRyaW0iLCJyZXBsYWNlIiwic2xpY2UiLCJldmVudCIsInRhcmdldElucHV0IiwidGFyZ2V0IiwiY29udGFpbnMiLCJ2YWxpZGF0ZVNpbmdsZUlucHV0IiwiaXNBbnlJbnB1dEZpbGxlZCIsIkFycmF5IiwiZnJvbSIsInNvbWUiLCJpbnB1dCIsImNoZWNrZWQiLCJyZW1vdmUiLCJ0eXBlIiwidGVzdCIsImlzUmFkaW9DaGVja2VkIiwicmFkaW8iLCJ2YWxpZGF0ZUlucHV0cyIsImlzVmFsaWQiLCJoYXNXYXJuaW5nIiwicHJldmVudERlZmF1bHQiLCJfZm9ybSRxdWVyeVNlbGVjdG9yIiwic3VjY2Vzc01lc3NhZ2UiLCJmb3JtRGF0YSIsInN1cm5hbWUiLCJmaXJzdE5hbWUiLCJtaWRkbGVOYW1lIiwicGhvbmUiLCJiaXJ0aERhdGUiLCJ0ZWxlZ3JhbU5pY2siLCJyZWdpb24iLCJpc01pbGl0YXJ5IiwiY29uc2VudCIsImNvbnNvbGUiLCJsb2ciLCJzZXRUaW1lb3V0IiwicmVzZXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQUEsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxZQUFZO0VBQ3RELElBQU1DLFFBQVEsR0FBR0YsUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyx1REFBdUQsQ0FBQztFQUVuRyxTQUFTQyxlQUFlQSxDQUFBLEVBQUc7SUFDdkJGLFFBQVEsQ0FBQ0csT0FBTyxDQUFDLFVBQUFDLEVBQUUsRUFBSTtNQUNuQixJQUFNQyxJQUFJLEdBQUdELEVBQUUsQ0FBQ0UscUJBQXFCLENBQUMsQ0FBQztNQUN2QyxJQUFJRCxJQUFJLENBQUNFLEdBQUcsR0FBR0MsTUFBTSxDQUFDQyxXQUFXLEdBQUcsR0FBRyxFQUFFO1FBQ3JDTCxFQUFFLENBQUNNLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFNBQVMsQ0FBQztNQUMvQjtJQUNKLENBQUMsQ0FBQztFQUNOO0VBRUFILE1BQU0sQ0FBQ1QsZ0JBQWdCLENBQUMsUUFBUSxFQUFFRyxlQUFlLENBQUM7RUFDbERBLGVBQWUsQ0FBQyxDQUFDO0FBQ3JCLENBQUMsQ0FBQzs7QUFFRjtBQUNBSixRQUFRLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVk7RUFDdEQsSUFBTWEsR0FBRyxHQUFHZCxRQUFRLENBQUNlLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztFQUMxRCxJQUFNQyxJQUFJLEdBQUdoQixRQUFRLENBQUNlLGFBQWEsQ0FBQyxZQUFZLENBQUM7RUFFakRELEdBQUcsQ0FBQ2IsZ0JBQWdCLENBQUMsT0FBTyxFQUFF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QztRQUVEc0IsT0FBTyxDQUFDQyxHQUFHLENBQUMsWUFBWSxFQUFFWCxRQUFRLENBQUM7UUFDbkMsSUFBSUQsY0FBYyxFQUFFO1VBQ2hCQSxjQUFjLENBQUNqRSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxTQUFTLENBQUM7VUFFdkM2RSxVQUFVLENBQUMsWUFBTTtZQUNiYixjQUFjLENBQUNqRSxTQUFTLENBQUN1RCxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQzFDbkQsSUFBSSxDQUFDMkUsS0FBSyxDQUFDLENBQUM7VUFDaEIsQ0FBQyxFQUFFLElBQUksQ0FBQztVQUVSZCxjQUFjLENBQUM1RSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtZQUMzQzRFLGNBQWMsQ0FBQ2pFLFNBQVMsQ0FBQ3VELE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDMUNuRCxJQUFJLENBQUMyRSxLQUFLLENBQUMsQ0FBQztVQUNoQixDQUFDLENBQUM7UUFDTjtNQUNKO0lBQ0osQ0FBQyxDQUFDO0VBQ04sQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2ZhZGUtaW4gd2hlbiB2aXNpYmxlXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZhZGUtaW4sIC5zbGlkZUluTGVmdCwgLnNsaWRlSW5SaWdodCwgLmZhZGVJbkZyb21Ub3BcIik7XG5cbiAgICBmdW5jdGlvbiBjaGVja1Zpc2liaWxpdHkoKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgaWYgKHJlY3QudG9wIDwgd2luZG93LmlubmVySGVpZ2h0ICogMC45KSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGNoZWNrVmlzaWJpbGl0eSk7XG4gICAgY2hlY2tWaXNpYmlsaXR5KCk7XG59KTtcblxuLy9vcGVuIGZvcm0gYmxvY2tcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhlYWRlcl9fY29udGVudC1idG5cIik7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlyc3RGb3JtXCIpO1xuXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmb3JtLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiIHx8IGZvcm0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIikge1xuICAgICAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gXCLQl9Cz0L7RgNC90YPRgtC4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IFwi0JTQvtGU0LTQvdCw0YLQuNGB0YxcIjtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbi8vc2xpZGVyXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzbGlkZXJXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX3dyYXBwZXJcIik7XG4gICAgY29uc3Qgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZXJfX3NsaWRlXCIpO1xuICAgIGNvbnN0IHByZXZCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fYnRuLXByZXZcIik7XG4gICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19idG4tbmV4dFwiKTtcbiAgICBjb25zdCBkb3RzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2RvdHNcIik7XG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IDA7XG4gICAgbGV0IGludGVydmFsO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCkge1xuICAgICAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzbGlkZS5zdHlsZS5kaXNwbGF5ID0gaW5kZXggPT09IGN1cnJlbnRJbmRleCA/IFwiZmxleFwiIDogXCJub25lXCI7XG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNsaWRlcl9fZG90XCIpLmZvckVhY2goKGRvdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGRvdC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIGluZGV4ID09PSBjdXJyZW50SW5kZXgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0U2xpZGUoKSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChjdXJyZW50SW5kZXggKyAxKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZTbGlkZSgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKGN1cnJlbnRJbmRleCAtIDEgKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0QXV0b1NsaWRlKCkge1xuICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKG5leHRTbGlkZSwgMzAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcEF1dG9TbGlkZSgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgc2xpZGVzLmZvckVhY2goKF8sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBkb3QuY2xhc3NMaXN0LmFkZChcInNsaWRlcl9fZG90XCIpO1xuICAgICAgICBkb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb3RzQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgfSk7XG5cbiAgICBwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2U2xpZGUpO1xuICAgIG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5leHRTbGlkZSk7XG5cbiAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICBzdGFydEF1dG9TbGlkZSgpO1xufSk7XG5cbi8vZm9ybVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJyk7ICAvLyDQktGB0LUg0YTQvtGA0LzRiyDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblxuICAgIGZvcm1zLmZvckVhY2goZm9ybSA9PiB7XG4gICAgICAgIGNvbnN0IHBob25lSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1waG9uZScpO1xuICAgICAgICBjb25zdCBkYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1kYXRlJyk7XG4gICAgICAgIGNvbnN0IHJlZ2lvbklucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtcmVnaW9uJyk7XG4gICAgICAgIGNvbnN0IGNoZWNrYm94SW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1jaGVja2JveCcpO1xuICAgICAgICBjb25zdCByYWRpb0lucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInllcy1ub1wiXScpOyAvLyDQlNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQstC+0LXQvdC90L7RgdC70YPQttCw0YnQtdCz0L5cbiAgICAgICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fc3VibWl0Jyk7XG4gICAgICAgIGNvbnN0IGFsbElucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmZvcm1fX2lucHV0Jyk7XG4gICAgICAgIGNvbnN0IHRlbGVncmFtSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC10ZWxlZ3JhbScpOyAvLyDQndGW0Log0LIg0YLQtdC70LXQs9GA0LDQvNGWXG4gICAgICAgIGNvbnN0IGZvcm1XYXJuaW5nID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fd2FybmluZycpOyAgLy8g0JrQvtC90YLQtdC50L3QtdGAINC00LvRjyDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC5XG5cbiAgICAgICAgLy8gdGVsZXBob25lXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGhvbmVJbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcGhvbmVJbnB1dC52YWx1ZSA9ICcrMzgnOyAvLyDQkNCy0YLQvtC30LDQv9C+0LvQvdC10L3QuNC1INC/0YDQuCDRhNC+0LrRg9GB0LVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGhvbmVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcrMzggJyArIHZhbHVlLnNsaWNlKDIsIDUpICsgJyAnICsgdmFsdWUuc2xpY2UoNSwgOCkgKyAnICcgKyB2YWx1ZS5zbGljZSg4LCAxMCkgKyAnICcgKyB2YWx1ZS5zbGljZSgxMCwgMTIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcrMzgnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vaW5wdXRcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SW5wdXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ3dhcm5pbmcnKSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlU2luZ2xlSW5wdXQodGFyZ2V0SW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpc0FueUlucHV0RmlsbGVkID0gQXJyYXkuZnJvbShhbGxJbnB1dHMpLnNvbWUoaW5wdXQgPT4gaW5wdXQudmFsdWUudHJpbSgpICE9PSBcIlwiIHx8IGlucHV0LmNoZWNrZWQpO1xuICAgICAgICAgICAgaWYgKGlzQW55SW5wdXRGaWxsZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY2hlY2sgMSBpbnB1dFxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZVNpbmdsZUlucHV0KGlucHV0KSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJkYXRlXCIgJiYgaW5wdXQudmFsdWUgPT09IFwiMjAwMC0wMS0wMVwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC52YWx1ZS50cmltKCkgPT09IFwiXCIgfHwgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcGhvbmUnKSAmJiAhL15cXCszOFxccypcXGR7M31cXHMqXFxkezN9XFxzKlxcZHsyfVxccypcXGR7Mn0kLy50ZXN0KGlucHV0LnZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmVnaW9uJykgJiYgaW5wdXQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtY2hlY2tib3gnKSAmJiAhaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yYWRpbycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNSYWRpb0NoZWNrZWQgPSBBcnJheS5mcm9tKHJhZGlvSW5wdXRzKS5zb21lKHJhZGlvID0+IHJhZGlvLmNoZWNrZWQpO1xuICAgICAgICAgICAgICAgIGlmICghaXNSYWRpb0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkYXRpb25cbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVJbnB1dHMoZm9ybSkge1xuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IGhhc1dhcm5pbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgYWxsSW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gdGVsZWdyYW1JbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwiZGF0ZVwiICYmIGlucHV0LnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC52YWx1ZS50cmltKCkgPT09IFwiXCIgfHwgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcGhvbmUnKSAmJiAhL15cXCszOFxccypcXGR7M31cXHMqXFxkezN9XFxzKlxcZHsyfVxccypcXGR7Mn0kLy50ZXN0KGlucHV0LnZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yZWdpb24nKSAmJiBpbnB1dC52YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LWNoZWNrYm94JykgJiYgIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yYWRpbycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzUmFkaW9DaGVja2VkID0gQXJyYXkuZnJvbShyYWRpb0lucHV0cykuc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JhZGlvQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNXYXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vc3VibWl0XG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICB2YWxpZGF0ZUlucHV0cyhmb3JtKTtcblxuICAgICAgICAgICAgaWYgKGZvcm0ucXVlcnlTZWxlY3RvcignLndhcm5pbmcnKSkge1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc3VybmFtZTogZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXN1cm5hbWVcIikudmFsdWUudHJpbSgpLFxuICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1maXJzdC1uYW1lXCIpLnZhbHVlLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgbWlkZGxlTmFtZTogZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LW1pZGRsZS1uYW1lXCIpLnZhbHVlLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgcGhvbmU6IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1waG9uZVwiKS52YWx1ZS50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIGJpcnRoRGF0ZTogZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWRhdGVcIikudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRlbGVncmFtTmljazogZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXRlbGVncmFtXCIpLnZhbHVlLnRyaW0oKSxcbiAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtcmVnaW9uXCIpLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBpc01pbGl0YXJ5OiBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtcmFkaW86Y2hlY2tlZFwiKT8udmFsdWUgfHwgXCJub1wiLFxuICAgICAgICAgICAgICAgICAgICBjb25zZW50OiBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtY2hlY2tib3hcIikuY2hlY2tlZCxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGb3JtIERhdGE6XCIsIGZvcm1EYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2Vzc01lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MDAwKTtcblxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5cblxuXG5cbiJdfQ==
