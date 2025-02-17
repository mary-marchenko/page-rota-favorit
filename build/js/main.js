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
  var touchStartX = 0;
  var touchEndX = 0;
  function updateSlider() {
    slides.forEach(function (slide, index) {
      slide.classList.remove("active", "opacity");
      slide.classList.add("".concat(index === currentIndex ? "active" : "opacity"));
    });
    document.querySelectorAll(".slider__dot").forEach(function (dot, index) {
      dot.classList.toggle("active", index === currentIndex);
    });
    stopAutoSlide();
    startAutoSlide();
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
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
  }
  function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
  }
  function handleSwipe() {
    var swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide();
    }
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

  // mob swipe
  sliderWrapper.addEventListener("touchstart", handleTouchStart);
  sliderWrapper.addEventListener("touchend", handleTouchEnd);
  updateSlider();
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

    //telephone
    phoneInput.addEventListener('focus', function () {
      if (phoneInput.value.trim() === '') {
        phoneInput.value = '+38';
      }
      // Если курсор оказался перед "+38", перемещаем его после
      if (this.selectionStart < 3) {
        this.setSelectionRange(3, 3);
      }
    });
    phoneInput.addEventListener('beforeinput', function (e) {
      var rawDigits = this.value.replace(/\D/g, ''); // Оставляем только цифры

      // Если пытаются ввести цифру, а уже 12 цифр – запрещаем ввод
      if (rawDigits.length >= 12 && /\d/.test(e.data)) {
        e.preventDefault();
      }
    });
    phoneInput.addEventListener('input', function () {
      var rawDigits = this.value.replace(/\D/g, ''); // Убираем все нецифровые символы
      var cursorPos = this.selectionStart; // Запоминаем позицию каретки

      // Формируем форматированный номер
      var formattedValue = '+38';
      if (rawDigits.length > 2) formattedValue += ' ' + rawDigits.slice(2, 5);
      if (rawDigits.length > 5) formattedValue += ' ' + rawDigits.slice(5, 8);
      if (rawDigits.length > 8) formattedValue += ' ' + rawDigits.slice(8, 10);
      if (rawDigits.length > 10) formattedValue += ' ' + rawDigits.slice(10, 12);

      // Запоминаем количество цифр до курсора
      var digitsBeforeCursor = this.value.slice(0, cursorPos).replace(/\D/g, '').length;
      this.value = formattedValue;

      // Определяем новую позицию каретки
      var newCursorPos = 3; // Начинаем после +38
      var digitCount = 0;
      for (var i = 0; i < formattedValue.length; i++) {
        if (/\d/.test(formattedValue[i])) digitCount++;
        if (digitCount === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }

      // Если курсор случайно оказался перед "+38", перемещаем его после
      if (newCursorPos < 3) newCursorPos = 3;
      this.setSelectionRange(newCursorPos, newCursorPos);
    });
    phoneInput.addEventListener('click', function () {
      // Если пользователь кликает перед "+38", перемещаем курсор после
      if (this.selectionStart < 3) {
        this.setSelectionRange(3, 3);
      }
    });

    //calendar
    dateInput.addEventListener('input', function () {
      var parts = this.value.split('-');
      if (parts[0] && parts[0].length > 4) {
        parts[0] = parts[0].slice(0, 4);
        this.value = parts.join('-');
      }
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

    function checkValid() {
      var isValid = false;
      var warnings = form.querySelectorAll(".warning");
      warnings.forEach(function (warning) {
        return warning.classList.remove("warning");
      }); // Очистити попередні помилки

      var addWarning = function addWarning(input, message) {
        isValid = false;
        input.classList.add("warning");
        var warningMessage = input.nextElementSibling;
        if (!warningMessage || !warningMessage.classList.contains("form__warning")) {
          warningMessage = document.createElement("p");
          warningMessage.classList.add("form__warning");
          warningMessage.textContent = message;
          input.parentNode.appendChild(warningMessage);
        }
      };
      var surnameValid = false;
      var firstNameValid = false;
      var secondNameValid = false;
      var phoneValid = false;
      var birthDateValid = false;
      var isMilitaryValid = false;
      var consentValid = false;
      var surname = form.querySelector(".form__input-surname");
      surname.addEventListener("input", function () {
        if (!surname.value.trim()) addWarning(surname, "Прізвище обов'язкове");
      });
      if (!surname.value.trim()) {
        addWarning(surname, "Прізвище обов'язкове");
      } else {
        surnameValid = true;
      }
      var firstName = form.querySelector(".form__input-first-name");
      if (!firstName.value.trim()) {
        addWarning(firstName, "Ім'я обов'язкове");
      } else {
        firstNameValid = true;
      }
      var secondName = form.querySelector(".form__input-middle-name");
      if (!secondName.value.trim()) {
        addWarning(secondName, "По батькові обов'язкове");
      } else {
        secondNameValid = true;
      }
      var phone = form.querySelector(".form__input-phone");
      if (!phone.value.trim() || !/^\+38\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.value)) {
        addWarning(phone, "Номер телефону обов'язковий");
      } else {
        phoneValid = true;
      }
      var birthDate = form.querySelector(".form__input-date");
      if (!birthDate.value || birthDate.value === "2000-01-01") {
        addWarning(birthDate, "Дата народження обов'язкова");
      } else {
        birthDateValid = true;
      }
      var isMilitary = form.querySelector(".form__input-radio:checked");
      if (!isMilitary) {
        addWarning(form.querySelector(".form__radio-group"), "Оберіть варіант");
      } else {
        isMilitaryValid = true;
      }
      var consent = form.querySelector(".form__input-checkbox");
      if (!consent.checked) {
        addWarning(consent, "Ви повинні погодитися з обробкою даних");
      } else {
        consentValid = true;
      }
      if (surnameValid && firstNameValid && secondNameValid && phoneValid && birthDateValid && isMilitaryValid && consentValid) {
        isValid = true;
      }
      if (!isValid) {
        formWarning.classList.add('visible');
        submitButton.classList.add('warning');
      } else {
        formWarning.classList.remove('visible');
        submitButton.classList.remove('warning');
      }
      return isValid;
    }
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault(); // Заблокувати стандартну відправку

        var isValid = checkValid();
        console.log(isValid);

        // Перевірка каптчі
        var recaptchaResponse = grecaptcha.getResponse(); // Отримуємо відповідь з каптчі
        if (recaptchaResponse.length === 0) {
          alert("Будь ласка, пройдіть перевірку reCAPTCHA.");
          document.querySelector('.content').classList.add('hidden'); // Сховати контент
          document.querySelector('.recaptcha').style.display = 'block'; // Показати каптчу
          return; // Якщо каптча не пройдена, не відправляємо форму
        }
        if (isValid) {
          var formData = new FormData(form);
          var successMessage = form.querySelector('.form__success');
          if (successMessage) {
            successMessage.classList.add('visible');
            setTimeout(function () {
              successMessage.classList.remove('visible');
              formWarning.classList.add('visible');
              form.reset();
            }, 5000);
            successMessage.addEventListener('click', function () {
              successMessage.classList.remove('visible');
              formWarning.classList.add('visible');
              form.reset();
            });
          }
          fetch(form.action, {
            method: "POST",
            body: formData
          }).then(function (response) {
            return response.text();
          }).then(function (data) {
            console.log(data); // Вивести відповідь від сервера

            var successMessage = form.querySelector('.form__success');
            var errorMessage = form.querySelector('.form__warning');
            if (data.includes("Дякуємо за вашу заявку!")) {
              // Показати повідомлення про успіх
              if (successMessage) {
                successMessage.classList.add('visible');
                setTimeout(function () {
                  successMessage.classList.remove('visible');
                  form.reset(); // Очистити форму
                }, 5000);
              }
            } else {
              // Показати повідомлення про помилку
            }
          })["catch"](function (error) {
            console.error("Помилка при відправці форми:", error);
            var errorMessage = form.querySelector('.form__warning');
            if (errorMessage) {
              errorMessage.textContent = "Помилка при відправці форми. Спробуйте ще раз.";
              errorMessage.classList.add('visible');
            }
          });
        }
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2hlY2tWaXNpYmlsaXR5IiwiZm9yRWFjaCIsImVsIiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwiY2xhc3NMaXN0IiwiYWRkIiwiYnRuIiwicXVlcnlTZWxlY3RvciIsImZvcm0iLCJzdHlsZSIsImRpc3BsYXkiLCJ0ZXh0Q29udGVudCIsInNsaWRlcldyYXBwZXIiLCJzbGlkZXMiLCJwcmV2QnRuIiwibmV4dEJ0biIsImRvdHNDb250YWluZXIiLCJjdXJyZW50SW5kZXgiLCJpbnRlcnZhbCIsInRvdWNoU3RhcnRYIiwidG91Y2hFbmRYIiwidXBkYXRlU2xpZGVyIiwic2xpZGUiLCJpbmRleCIsInJlbW92ZSIsImNvbmNhdCIsImRvdCIsInRvZ2dsZSIsInN0b3BBdXRvU2xpZGUiLCJzdGFydEF1dG9TbGlkZSIsIm5leHRTbGlkZSIsImxlbmd0aCIsInByZXZTbGlkZSIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImhhbmRsZVRvdWNoU3RhcnQiLCJldmVudCIsInRvdWNoZXMiLCJjbGllbnRYIiwiaGFuZGxlVG91Y2hFbmQiLCJjaGFuZ2VkVG91Y2hlcyIsImhhbmRsZVN3aXBlIiwic3dpcGVUaHJlc2hvbGQiLCJfIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiZm9ybXMiLCJwaG9uZUlucHV0IiwiZGF0ZUlucHV0IiwicmVnaW9uSW5wdXQiLCJjaGVja2JveElucHV0IiwicmFkaW9JbnB1dHMiLCJzdWJtaXRCdXR0b24iLCJhbGxJbnB1dHMiLCJ0ZWxlZ3JhbUlucHV0IiwiZm9ybVdhcm5pbmciLCJ2YWx1ZSIsInRyaW0iLCJzZWxlY3Rpb25TdGFydCIsInNldFNlbGVjdGlvblJhbmdlIiwiZSIsInJhd0RpZ2l0cyIsInJlcGxhY2UiLCJ0ZXN0IiwiZGF0YSIsInByZXZlbnREZWZhdWx0IiwiY3Vyc29yUG9zIiwiZm9ybWF0dGVkVmFsdWUiLCJzbGljZSIsImRpZ2l0c0JlZm9yZUN1cnNvciIsIm5ld0N1cnNvclBvcyIsImRpZ2l0Q291bnQiLCJpIiwicGFydHMiLCJzcGxpdCIsImpvaW4iLCJ0YXJnZXRJbnB1dCIsInRhcmdldCIsImNvbnRhaW5zIiwidmFsaWRhdGVTaW5nbGVJbnB1dCIsImlzQW55SW5wdXRGaWxsZWQiLCJBcnJheSIsImZyb20iLCJzb21lIiwiaW5wdXQiLCJjaGVja2VkIiwidHlwZSIsImlzUmFkaW9DaGVja2VkIiwicmFkaW8iLCJjaGVja1ZhbGlkIiwiaXNWYWxpZCIsIndhcm5pbmdzIiwid2FybmluZyIsImFkZFdhcm5pbmciLCJtZXNzYWdlIiwid2FybmluZ01lc3NhZ2UiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJwYXJlbnROb2RlIiwic3VybmFtZVZhbGlkIiwiZmlyc3ROYW1lVmFsaWQiLCJzZWNvbmROYW1lVmFsaWQiLCJwaG9uZVZhbGlkIiwiYmlydGhEYXRlVmFsaWQiLCJpc01pbGl0YXJ5VmFsaWQiLCJjb25zZW50VmFsaWQiLCJzdXJuYW1lIiwiZmlyc3ROYW1lIiwic2Vjb25kTmFtZSIsInBob25lIiwiYmlydGhEYXRlIiwiaXNNaWxpdGFyeSIsImNvbnNlbnQiLCJjb25zb2xlIiwibG9nIiwicmVjYXB0Y2hhUmVzcG9uc2UiLCJncmVjYXB0Y2hhIiwiZ2V0UmVzcG9uc2UiLCJhbGVydCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJzdWNjZXNzTWVzc2FnZSIsInNldFRpbWVvdXQiLCJyZXNldCIsImZldGNoIiwiYWN0aW9uIiwibWV0aG9kIiwiYm9keSIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJlcnJvck1lc3NhZ2UiLCJpbmNsdWRlcyIsImVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0FBLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBWTtFQUN0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YyxFQUFFO2dCQUNoQkEsY0FBYyxDQUFDcEgsU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUN2Q29ILFVBQVUsQ0FBQyxZQUFNO2tCQUNiRCxjQUFjLENBQUNwSCxTQUFTLENBQUNvQixNQUFNLENBQUMsU0FBUyxDQUFDO2tCQUMxQ2hCLElBQUksQ0FBQ2tILEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQztjQUNaO1lBQ0osQ0FBQyxNQUFNO2NBQ0g7WUFBQTtVQUVSLENBQUMsQ0FBQyxTQUNJLENBQUMsVUFBQVUsS0FBSyxFQUFJO1lBQ1pwQixPQUFPLENBQUNvQixLQUFLLENBQUMsOEJBQThCLEVBQUVBLEtBQUssQ0FBQztZQUNwRCxJQUFNRixZQUFZLEdBQUcxSCxJQUFJLENBQUNELGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztZQUN6RCxJQUFJMkgsWUFBWSxFQUFFO2NBQ2RBLFlBQVksQ0FBQ3ZILFdBQVcsR0FBRyxnREFBZ0Q7Y0FDM0V1SCxZQUFZLENBQUM5SCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDekM7VUFDSixDQUFDLENBQUM7UUFDVjtNQUNKLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztFQUdOLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9mYWRlLWluIHdoZW4gdmlzaWJsZVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mYWRlLWluLCAuc2xpZGVJbkxlZnQsIC5zbGlkZUluUmlnaHQsIC5mYWRlSW5Gcm9tVG9wXCIpO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tWaXNpYmlsaXR5KCkge1xuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmIChyZWN0LnRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuOSkge1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoXCJ2aXNpYmxlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBjaGVja1Zpc2liaWxpdHkpO1xuICAgIGNoZWNrVmlzaWJpbGl0eSgpO1xufSk7XG5cbi8vb3BlbiBmb3JtIGJsb2NrXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oZWFkZXJfX2NvbnRlbnQtYnRuXCIpO1xuICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZpcnN0Rm9ybVwiKTtcblxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZm9ybS5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIiB8fCBmb3JtLnN0eWxlLmRpc3BsYXkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IFwi0JfQs9C+0YDQvdGD0YLQuFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBcItCU0L7RlNC00L3QsNGC0LjRgdGMXCI7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG4vL3NsaWRlclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHNsaWRlcldyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fd3JhcHBlclwiKTtcbiAgICBjb25zdCBzbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNsaWRlcl9fc2xpZGVcIik7XG4gICAgY29uc3QgcHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19idG4tcHJldlwiKTtcbiAgICBjb25zdCBuZXh0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2J0bi1uZXh0XCIpO1xuICAgIGNvbnN0IGRvdHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fZG90c1wiKTtcbiAgICBsZXQgY3VycmVudEluZGV4ID0gMDtcbiAgICBsZXQgaW50ZXJ2YWw7XG4gICAgbGV0IHRvdWNoU3RhcnRYID0gMDtcbiAgICBsZXQgdG91Y2hFbmRYID0gMDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlcigpIHtcbiAgICAgICAgc2xpZGVzLmZvckVhY2goKHNsaWRlLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiLCBcIm9wYWNpdHlcIilcbiAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5hZGQoYCR7aW5kZXggPT09IGN1cnJlbnRJbmRleCA/IFwiYWN0aXZlXCIgOiBcIm9wYWNpdHlcIn1gKVxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZXJfX2RvdFwiKS5mb3JFYWNoKChkb3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBkb3QuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBpbmRleCA9PT0gY3VycmVudEluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3RvcEF1dG9TbGlkZSgpO1xuICAgICAgICBzdGFydEF1dG9TbGlkZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5leHRTbGlkZSgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKGN1cnJlbnRJbmRleCArIDEpICUgc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldlNsaWRlKCkge1xuICAgICAgICBjdXJyZW50SW5kZXggPSAoY3VycmVudEluZGV4IC0gMSArIHNsaWRlcy5sZW5ndGgpICUgc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRBdXRvU2xpZGUoKSB7XG4gICAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwobmV4dFNsaWRlLCAzMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9wQXV0b1NsaWRlKCkge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRvdWNoU3RhcnRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIHRvdWNoRW5kWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIGhhbmRsZVN3aXBlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlU3dpcGUoKSB7XG4gICAgICAgIGNvbnN0IHN3aXBlVGhyZXNob2xkID0gNTA7XG4gICAgICAgIGlmICh0b3VjaFN0YXJ0WCAtIHRvdWNoRW5kWCA+IHN3aXBlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBuZXh0U2xpZGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0b3VjaEVuZFggLSB0b3VjaFN0YXJ0WCA+IHN3aXBlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBwcmV2U2xpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNsaWRlcy5mb3JFYWNoKChfLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgZG90LmNsYXNzTGlzdC5hZGQoXCJzbGlkZXJfX2RvdFwiKTtcbiAgICAgICAgZG90LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG90c0NvbnRhaW5lci5hcHBlbmRDaGlsZChkb3QpO1xuICAgIH0pO1xuXG4gICAgcHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHJldlNsaWRlKTtcbiAgICBuZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBuZXh0U2xpZGUpO1xuXG4gICAgLy8gbW9iIHN3aXBlXG4gICAgc2xpZGVyV3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBoYW5kbGVUb3VjaFN0YXJ0KTtcbiAgICBzbGlkZXJXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVUb3VjaEVuZCk7XG5cbiAgICB1cGRhdGVTbGlkZXIoKTtcbn0pO1xuXG5cbi8vZm9ybVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpOyAgLy8g0JLRgdC1INGE0L7RgNC80Ysg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cbiAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICAgICAgICBjb25zdCBwaG9uZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtcGhvbmUnKTtcbiAgICAgICAgY29uc3QgZGF0ZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtZGF0ZScpO1xuICAgICAgICBjb25zdCByZWdpb25JbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX2lucHV0LXJlZ2lvbicpO1xuICAgICAgICBjb25zdCBjaGVja2JveElucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtY2hlY2tib3gnKTtcbiAgICAgICAgY29uc3QgcmFkaW9JbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJ5ZXMtbm9cIl0nKTsgLy8g0JTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0LLQvtC10L3QvdC+0YHQu9GD0LbQsNGJ0LXQs9C+XG4gICAgICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Ym1pdCcpO1xuICAgICAgICBjb25zdCBhbGxJbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtX19pbnB1dCcpO1xuICAgICAgICBjb25zdCB0ZWxlZ3JhbUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtdGVsZWdyYW0nKTsgLy8g0J3RltC6INCyINGC0LXQu9C10LPRgNCw0LzRllxuICAgICAgICBjb25zdCBmb3JtV2FybmluZyA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTsgIC8vINCa0L7QvdGC0LXQudC90LXRgCDQtNC70Y8g0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQuVxuXG4gICAgICAgIC8vdGVsZXBob25lXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGhvbmVJbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcGhvbmVJbnB1dC52YWx1ZSA9ICcrMzgnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LrRg9GA0YHQvtGAINC+0LrQsNC30LDQu9GB0Y8g0L/QtdGA0LXQtCBcIiszOFwiLCDQv9C10YDQtdC80LXRidCw0LXQvCDQtdCz0L4g0L/QvtGB0LvQtVxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uU3RhcnQgPCAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb25SYW5nZSgzLCAzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGhvbmVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmVpbnB1dCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBsZXQgcmF3RGlnaXRzID0gdGhpcy52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpOyAvLyDQntGB0YLQsNCy0LvRj9C10Lwg0YLQvtC70YzQutC+INGG0LjRhNGA0YtcblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0L/Ri9GC0LDRjtGC0YHRjyDQstCy0LXRgdGC0Lgg0YbQuNGE0YDRgywg0LAg0YPQttC1IDEyINGG0LjRhNGAIOKAkyDQt9Cw0L/RgNC10YnQsNC10Lwg0LLQstC+0LRcbiAgICAgICAgICAgIGlmIChyYXdEaWdpdHMubGVuZ3RoID49IDEyICYmIC9cXGQvLnRlc3QoZS5kYXRhKSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGhvbmVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCByYXdEaWdpdHMgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7IC8vINCj0LHQuNGA0LDQtdC8INCy0YHQtSDQvdC10YbQuNGE0YDQvtCy0YvQtSDRgdC40LzQstC+0LvRi1xuICAgICAgICAgICAgbGV0IGN1cnNvclBvcyA9IHRoaXMuc2VsZWN0aW9uU3RhcnQ7IC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INC/0L7Qt9C40YbQuNGOINC60LDRgNC10YLQutC4XG5cbiAgICAgICAgICAgIC8vINCk0L7RgNC80LjRgNGD0LXQvCDRhNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QvdGL0Lkg0L3QvtC80LXRgFxuICAgICAgICAgICAgbGV0IGZvcm1hdHRlZFZhbHVlID0gJyszOCc7XG4gICAgICAgICAgICBpZiAocmF3RGlnaXRzLmxlbmd0aCA+IDIpIGZvcm1hdHRlZFZhbHVlICs9ICcgJyArIHJhd0RpZ2l0cy5zbGljZSgyLCA1KTtcbiAgICAgICAgICAgIGlmIChyYXdEaWdpdHMubGVuZ3RoID4gNSkgZm9ybWF0dGVkVmFsdWUgKz0gJyAnICsgcmF3RGlnaXRzLnNsaWNlKDUsIDgpO1xuICAgICAgICAgICAgaWYgKHJhd0RpZ2l0cy5sZW5ndGggPiA4KSBmb3JtYXR0ZWRWYWx1ZSArPSAnICcgKyByYXdEaWdpdHMuc2xpY2UoOCwgMTApO1xuICAgICAgICAgICAgaWYgKHJhd0RpZ2l0cy5sZW5ndGggPiAxMCkgZm9ybWF0dGVkVmFsdWUgKz0gJyAnICsgcmF3RGlnaXRzLnNsaWNlKDEwLCAxMik7XG5cbiAgICAgICAgICAgIC8vINCX0LDQv9C+0LzQuNC90LDQtdC8INC60L7Qu9C40YfQtdGB0YLQstC+INGG0LjRhNGAINC00L4g0LrRg9GA0YHQvtGA0LBcbiAgICAgICAgICAgIGxldCBkaWdpdHNCZWZvcmVDdXJzb3IgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGN1cnNvclBvcykucmVwbGFjZSgvXFxEL2csICcnKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBmb3JtYXR0ZWRWYWx1ZTtcblxuICAgICAgICAgICAgLy8g0J7Qv9GA0LXQtNC10LvRj9C10Lwg0L3QvtCy0YPRjiDQv9C+0LfQuNGG0LjRjiDQutCw0YDQtdGC0LrQuFxuICAgICAgICAgICAgbGV0IG5ld0N1cnNvclBvcyA9IDM7IC8vINCd0LDRh9C40L3QsNC10Lwg0L/QvtGB0LvQtSArMzhcbiAgICAgICAgICAgIGxldCBkaWdpdENvdW50ID0gMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtYXR0ZWRWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICgvXFxkLy50ZXN0KGZvcm1hdHRlZFZhbHVlW2ldKSkgZGlnaXRDb3VudCsrO1xuICAgICAgICAgICAgICAgIGlmIChkaWdpdENvdW50ID09PSBkaWdpdHNCZWZvcmVDdXJzb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q3Vyc29yUG9zID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JXRgdC70Lgg0LrRg9GA0YHQvtGAINGB0LvRg9GH0LDQudC90L4g0L7QutCw0LfQsNC70YHRjyDQv9C10YDQtdC0IFwiKzM4XCIsINC/0LXRgNC10LzQtdGJ0LDQtdC8INC10LPQviDQv9C+0YHQu9C1XG4gICAgICAgICAgICBpZiAobmV3Q3Vyc29yUG9zIDwgMykgbmV3Q3Vyc29yUG9zID0gMztcblxuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb25SYW5nZShuZXdDdXJzb3JQb3MsIG5ld0N1cnNvclBvcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyDQldGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LrQu9C40LrQsNC10YIg0L/QtdGA0LXQtCBcIiszOFwiLCDQv9C10YDQtdC80LXRidCw0LXQvCDQutGD0YDRgdC+0YAg0L/QvtGB0LvQtVxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uU3RhcnQgPCAzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb25SYW5nZSgzLCAzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuXG4gICAgICAgIC8vY2FsZW5kYXJcbiAgICAgICAgZGF0ZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgcGFydHMgPSB0aGlzLnZhbHVlLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBpZiAocGFydHNbMF0gJiYgcGFydHNbMF0ubGVuZ3RoID4gNCkge1xuICAgICAgICAgICAgICAgIHBhcnRzWzBdID0gcGFydHNbMF0uc2xpY2UoMCwgNCk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHBhcnRzLmpvaW4oJy0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9pbnB1dFxuICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJbnB1dCA9IGV2ZW50LnRhcmdldDtcblxuICAgICAgICAgICAgaWYgKHRhcmdldElucHV0LmNsYXNzTGlzdC5jb250YWlucygnd2FybmluZycpKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVTaW5nbGVJbnB1dCh0YXJnZXRJbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlzQW55SW5wdXRGaWxsZWQgPSBBcnJheS5mcm9tKGFsbElucHV0cykuc29tZShpbnB1dCA9PiBpbnB1dC52YWx1ZS50cmltKCkgIT09IFwiXCIgfHwgaW5wdXQuY2hlY2tlZCk7XG4gICAgICAgICAgICBpZiAoaXNBbnlJbnB1dEZpbGxlZCkge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBjaGVjayAxIGlucHV0XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlU2luZ2xlSW5wdXQoaW5wdXQpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcImRhdGVcIiAmJiBpbnB1dC52YWx1ZSA9PT0gXCIyMDAwLTAxLTAxXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnZhbHVlLnRyaW0oKSA9PT0gXCJcIiB8fCAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1waG9uZScpICYmICEvXlxcKzM4XFxzKlxcZHszfVxccypcXGR7M31cXHMqXFxkezJ9XFxzKlxcZHsyfSQvLnRlc3QoaW5wdXQudmFsdWUpKSkge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yZWdpb24nKSAmJiBpbnB1dC52YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1jaGVja2JveCcpICYmICFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXJhZGlvJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JhZGlvQ2hlY2tlZCA9IEFycmF5LmZyb20ocmFkaW9JbnB1dHMpLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1JhZGlvQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWRhdGlvblxuXG4gICAgICAgIGZ1bmN0aW9uICBjaGVja1ZhbGlkKCl7XG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBjb25zdCB3YXJuaW5ncyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcIi53YXJuaW5nXCIpO1xuICAgICAgICAgICAgd2FybmluZ3MuZm9yRWFjaCh3YXJuaW5nID0+IHdhcm5pbmcuY2xhc3NMaXN0LnJlbW92ZShcIndhcm5pbmdcIikpOyAvLyDQntGH0LjRgdGC0LjRgtC4INC/0L7Qv9C10YDQtdC00L3RliDQv9C+0LzQuNC70LrQuFxuXG4gICAgICAgICAgICBjb25zdCBhZGRXYXJuaW5nID0gKGlucHV0LCBtZXNzYWdlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcIndhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgbGV0IHdhcm5pbmdNZXNzYWdlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmICghd2FybmluZ01lc3NhZ2UgfHwgIXdhcm5pbmdNZXNzYWdlLmNsYXNzTGlzdC5jb250YWlucyhcImZvcm1fX3dhcm5pbmdcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZ01lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZ01lc3NhZ2UuY2xhc3NMaXN0LmFkZChcImZvcm1fX3dhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdNZXNzYWdlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh3YXJuaW5nTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHN1cm5hbWVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgZmlyc3ROYW1lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IHNlY29uZE5hbWVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgcGhvbmVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgYmlydGhEYXRlVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGlzTWlsaXRhcnlWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgY29uc2VudFZhbGlkID0gZmFsc2VcblxuXG4gICAgICAgICAgICBjb25zdCBzdXJuYW1lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXN1cm5hbWVcIik7XG4gICAgICAgICAgICBzdXJuYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PntcbiAgICAgICAgICAgICAgICBpZiAoIXN1cm5hbWUudmFsdWUudHJpbSgpKSBhZGRXYXJuaW5nKHN1cm5hbWUsIFwi0J/RgNGW0LfQstC40YnQtSDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYgKCFzdXJuYW1lLnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoc3VybmFtZSwgXCLQn9GA0ZbQt9Cy0LjRidC1INC+0LHQvtCyJ9GP0LfQutC+0LLQtVwiKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc3VybmFtZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBmaXJzdE5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtZmlyc3QtbmFtZVwiKTtcbiAgICAgICAgICAgIGlmICghZmlyc3ROYW1lLnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoZmlyc3ROYW1lLCBcItCG0Lwn0Y8g0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kTmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1taWRkbGUtbmFtZVwiKTtcbiAgICAgICAgICAgIGlmICghc2Vjb25kTmFtZS52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKHNlY29uZE5hbWUsIFwi0J/QviDQsdCw0YLRjNC60L7QstGWINC+0LHQvtCyJ9GP0LfQutC+0LLQtVwiKTtcblxuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzZWNvbmROYW1lVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHBob25lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXBob25lXCIpO1xuICAgICAgICAgICAgaWYgKCFwaG9uZS52YWx1ZS50cmltKCkgfHwgIS9eXFwrMzhcXHM/XFxkezN9XFxzP1xcZHszfVxccz9cXGR7Mn1cXHM/XFxkezJ9JC8udGVzdChwaG9uZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKHBob25lLCBcItCd0L7QvNC10YAg0YLQtdC70LXRhNC+0L3RgyDQvtCx0L7QsifRj9C30LrQvtCy0LjQuVwiKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcGhvbmVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYmlydGhEYXRlID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWRhdGVcIik7XG4gICAgICAgICAgICBpZiAoIWJpcnRoRGF0ZS52YWx1ZSB8fCBiaXJ0aERhdGUudmFsdWUgPT09IFwiMjAwMC0wMS0wMVwiKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhiaXJ0aERhdGUsIFwi0JTQsNGC0LAg0L3QsNGA0L7QtNC20LXQvdC90Y8g0L7QsdC+0LIn0Y/Qt9C60L7QstCwXCIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgYmlydGhEYXRlVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlzTWlsaXRhcnkgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtcmFkaW86Y2hlY2tlZFwiKTtcbiAgICAgICAgICAgIGlmICghaXNNaWxpdGFyeSl7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9fcmFkaW8tZ3JvdXBcIiksIFwi0J7QsdC10YDRltGC0Ywg0LLQsNGA0ZbQsNC90YJcIik7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNNaWxpdGFyeVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb25zZW50ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWNoZWNrYm94XCIpO1xuICAgICAgICAgICAgaWYgKCFjb25zZW50LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGNvbnNlbnQsIFwi0JLQuCDQv9C+0LLQuNC90L3RliDQv9C+0LPQvtC00LjRgtC40YHRjyDQtyDQvtCx0YDQvtCx0LrQvtGOINC00LDQvdC40YVcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zZW50VmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdXJuYW1lVmFsaWQgJiYgZmlyc3ROYW1lVmFsaWQgJiYgc2Vjb25kTmFtZVZhbGlkICYmIHBob25lVmFsaWQgJiYgYmlydGhEYXRlVmFsaWQgJiYgaXNNaWxpdGFyeVZhbGlkICYmIGNvbnNlbnRWYWxpZCl7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZFxuICAgICAgICB9XG5cblxuICAgICAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICAgICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vINCX0LDQsdC70L7QutGD0LLQsNGC0Lgg0YHRgtCw0L3QtNCw0YDRgtC90YMg0LLRltC00L/RgNCw0LLQutGDXG5cbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGNoZWNrVmFsaWQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpc1ZhbGlkKTtcblxuICAgICAgICAgICAgICAgIC8vINCf0LXRgNC10LLRltGA0LrQsCDQutCw0L/RgtGH0ZZcbiAgICAgICAgICAgICAgICBjb25zdCByZWNhcHRjaGFSZXNwb25zZSA9IGdyZWNhcHRjaGEuZ2V0UmVzcG9uc2UoKTsgLy8g0J7RgtGA0LjQvNGD0ZTQvNC+INCy0ZbQtNC/0L7QstGW0LTRjCDQtyDQutCw0L/RgtGH0ZZcbiAgICAgICAgICAgICAgICBpZiAocmVjYXB0Y2hhUmVzcG9uc2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi0JHRg9C00Ywg0LvQsNGB0LrQsCwg0L/RgNC+0LnQtNGW0YLRjCDQv9C10YDQtdCy0ZbRgNC60YMgcmVDQVBUQ0hBLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTsgLy8g0KHRhdC+0LLQsNGC0Lgg0LrQvtC90YLQtdC90YJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlY2FwdGNoYScpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snOyAvLyDQn9C+0LrQsNC30LDRgtC4INC60LDQv9GC0YfRg1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vINCv0LrRidC+INC60LDQv9GC0YfQsCDQvdC1INC/0YDQvtC50LTQtdC90LAsINC90LUg0LLRltC00L/RgNCw0LLQu9GP0ZTQvNC+INGE0L7RgNC80YNcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmZXRjaChmb3JtLmFjdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTsgLy8g0JLQuNCy0LXRgdGC0Lgg0LLRltC00L/QvtCy0ZbQtNGMINCy0ZbQtCDRgdC10YDQstC10YDQsFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc01lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fd2FybmluZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaW5jbHVkZXMoXCLQlNGP0LrRg9GU0LzQviDQt9CwINCy0LDRiNGDINC30LDRj9Cy0LrRgyFcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INGD0YHQv9GW0YVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpOyAvLyDQntGH0LjRgdGC0LjRgtC4INGE0L7RgNC80YNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INC/0L7QvNC40LvQutGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuDpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwi0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0ZbQtNC/0YDQsNCy0YbRliDRhNC+0YDQvNC4LiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICB9KTtcbn0pO1xuXG5cblxuIl19
