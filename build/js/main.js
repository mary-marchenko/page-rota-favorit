"use strict";

//button for TEST
document.addEventListener('DOMContentLoaded', function () {
  var modalOverlays = document.querySelectorAll('.form__success');
  var openModalBtns = document.querySelectorAll('.dark-btn');
  if (modalOverlays.length === 0 || openModalBtns.length === 0) {
    console.error("Елементи не знайдено!");
    return;
  }
  openModalBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      modalOverlays.forEach(function (modal) {
        modal.style.display = 'flex'; // Відкриває всі .form__success
      });
    });
  });
  modalOverlays.forEach(function (modal) {
    modal.addEventListener('click', function () {
      this.style.display = 'none';
    });
  });
});

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
      slide.style.display = index === currentIndex ? "flex" : "none";
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
      return isValid;
    }
    function checkValid() {
      var isValid = false;
      var warnings = form.querySelectorAll(".warning");
      warnings.forEach(function (warning) {
        return warning.classList.remove("warning");
      }); // Очистити попередні помилки

      // Функція для додавання попередження
      var addWarning = function addWarning(input, message) {
        // console.log(input)

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

      // Валідація текстових полів
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

      // Валідація телефону
      var phone = form.querySelector(".form__input-phone");
      if (!phone.value.trim() || !/^\+38\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.value)) {
        addWarning(phone, "Номер телефону обов'язковий");
      } else {
        phoneValid = true;
      }

      // Валідація дати народження
      var birthDate = form.querySelector(".form__input-date");
      if (!birthDate.value || birthDate.value === "2000-01-01") {
        addWarning(birthDate, "Дата народження обов'язкова");
      } else {
        birthDateValid = true;
      }

      // Валідація військовослужбовця
      var isMilitary = form.querySelector(".form__input-radio:checked");
      if (!isMilitary) {
        addWarning(form.querySelector(".form__radio-group"), "Оберіть варіант");
      } else {
        isMilitaryValid = true;
      }

      // Валідація згоди на обробку даних
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
        // validateInputs(form)
        var isValid = checkValid();
        console.log(isValid);
        if (isValid) {
          console.log("dsad");
          var formData = new FormData(form); //

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
            // console.log(data); // Вивести відповідь від сервера

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
              if (errorMessage) {
                errorMessage.textContent = "Помилка при відправці форми. Спробуйте ще раз.";
                errorMessage.classList.add('visible');
              }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kYWxPdmVybGF5cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvcGVuTW9kYWxCdG5zIiwibGVuZ3RoIiwiY29uc29sZSIsImVycm9yIiwiZm9yRWFjaCIsImJ0biIsIm1vZGFsIiwic3R5bGUiLCJkaXNwbGF5IiwiZWxlbWVudHMiLCJjaGVja1Zpc2liaWxpdHkiLCJlbCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImNsYXNzTGlzdCIsImFkZCIsInF1ZXJ5U2VsZWN0b3IiLCJmb3JtIiwidGV4dENvbnRlbnQiLCJzbGlkZXJXcmFwcGVyIiwic2xpZGVzIiwicHJldkJ0biIsIm5leHRCdG4iLCJkb3RzQ29udGFpbmVyIiwiY3VycmVudEluZGV4IiwiaW50ZXJ2YWwiLCJ0b3VjaFN0YXJ0WCIsInRvdWNoRW5kWCIsInVwZGF0ZVNsaWRlciIsInNsaWRlIiwiaW5kZXgiLCJkb3QiLCJ0b2dnbGUiLCJzdG9wQXV0b1NsaWRlIiwic3RhcnRBdXRvU2xpZGUiLCJuZXh0U2xpZGUiLCJwcmV2U2xpZGUiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJoYW5kbGVUb3VjaFN0YXJ0IiwiZXZlbnQiLCJ0b3VjaGVzIiwiY2xpZW50WCIsImhhbmRsZVRvdWNoRW5kIiwiY2hhbmdlZFRvdWNoZXMiLCJoYW5kbGVTd2lwZSIsInN3aXBlVGhyZXNob2xkIiwiXyIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImZvcm1zIiwicGhvbmVJbnB1dCIsImRhdGVJbnB1dCIsInJlZ2lvbklucHV0IiwiY2hlY2tib3hJbnB1dCIsInJhZGlvSW5wdXRzIiwic3VibWl0QnV0dG9uIiwiYWxsSW5wdXRzIiwidGVsZWdyYW1JbnB1dCIsImZvcm1XYXJuaW5nIiwidmFsdWUiLCJ0cmltIiwicmVwbGFjZSIsInNsaWNlIiwidGFyZ2V0SW5wdXQiLCJ0YXJnZXQiLCJjb250YWlucyIsInZhbGlkYXRlU2luZ2xlSW5wdXQiLCJpc0FueUlucHV0RmlsbGVkIiwiQXJyYXkiLCJmcm9tIiwic29tZSIsImlucHV0IiwiY2hlY2tlZCIsInJlbW92ZSIsInR5cGUiLCJ0ZXN0IiwiaXNSYWRpb0NoZWNrZWQiLCJyYWRpbyIsInZhbGlkYXRlSW5wdXRzIiwiaXNWYWxpZCIsImhhc1dhcm5pbmciLCJjaGVja1ZhbGlkIiwid2FybmluZ3MiLCJ3YXJuaW5nIiwiYWRkV2FybmluZyIsIm1lc3NhZ2UiLCJ3YXJuaW5nTWVzc2FnZSIsIm5leHRFbGVtZW50U2libGluZyIsInBhcmVudE5vZGUiLCJzdXJuYW1lVmFsaWQiLCJmaXJzdE5hbWVWYWxpZCIsInNlY29uZE5hbWVWYWxpZCIsInBob25lVmFsaWQiLCJiaXJ0aERhdGVWYWxpZCIsImlzTWlsaXRhcnlWYWxpZCIsImNvbnNlbnRWYWxpZCIsInN1cm5hbWUiLCJmaXJzdE5hbWUiLCJzZWNvbmROYW1lIiwicGhvbmUiLCJiaXJ0aERhdGUiLCJpc01pbGl0YXJ5IiwiY29uc2VudCIsInByZXZlbnREZWZhdWx0IiwibG9nIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInN1Y2Nlc3NNZXNzYWdlIiwic2V0VGltZW91dCIsInJlc2V0IiwiZmV0Y2giLCJhY3Rpb24iLCJtZXRob2QiLCJib2R5IiwidGhlbiIsInJlc3BvbnNlIiwidGV4dCIsImRhdGEiLCJlcnJvck1lc3NhZ2UiLCJpbmNsdWRlcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxRQUFRLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVc7RUFDckQsSUFBTUMsYUFBYSxHQUFHRixRQUFRLENBQUNHLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO0VBQ2pFLElBQU1DLGFBQWEsR0FBR0osUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7RUFFNUQsSUFBSUQsYUFBYSxDQUFDRyxNQUFNLEtBQUssQ0FBQyxJQUFJ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LENBQUMsZ0JBQWdCLENBQUM7WUFDekQsSUFBSXVHLFlBQVksRUFBRTtjQUNkQSxZQUFZLENBQUNyRyxXQUFXLEdBQUcsZ0RBQWdEO2NBQzNFcUcsWUFBWSxDQUFDekcsU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQ3pDO1VBQ0osQ0FBQyxDQUFDO1FBQ1Y7TUFDSixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7RUFFTixDQUFDLENBQUM7QUFDTixDQUFDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vYnV0dG9uIGZvciBURVNUXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kYWxPdmVybGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgY29uc3Qgb3Blbk1vZGFsQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXJrLWJ0bicpO1xuXG4gICAgaWYgKG1vZGFsT3ZlcmxheXMubGVuZ3RoID09PSAwIHx8IG9wZW5Nb2RhbEJ0bnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLQldC70LXQvNC10L3RgtC4INC90LUg0LfQvdCw0LnQtNC10L3QviFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcGVuTW9kYWxCdG5zLmZvckVhY2goYnRuID0+IHtcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2RhbE92ZXJsYXlzLmZvckVhY2gobW9kYWwgPT4ge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7IC8vINCS0ZbQtNC60YDQuNCy0LDRlCDQstGB0ZYgLmZvcm1fX3N1Y2Nlc3NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIG1vZGFsT3ZlcmxheXMuZm9yRWFjaChtb2RhbCA9PiB7XG4gICAgICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbi8vZmFkZS1pbiB3aGVuIHZpc2libGVcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmFkZS1pbiwgLnNsaWRlSW5MZWZ0LCAuc2xpZGVJblJpZ2h0LCAuZmFkZUluRnJvbVRvcFwiKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrVmlzaWJpbGl0eSgpIHtcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBpZiAocmVjdC50b3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjkpIHtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgY2hlY2tWaXNpYmlsaXR5KTtcbiAgICBjaGVja1Zpc2liaWxpdHkoKTtcbn0pO1xuXG4vL29wZW4gZm9ybSBibG9ja1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGVhZGVyX19jb250ZW50LWJ0blwiKTtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maXJzdEZvcm1cIik7XG5cbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGZvcm0uc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgfHwgZm9ybS5zdHlsZS5kaXNwbGF5ID09PSBcIlwiKSB7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBcItCX0LPQvtGA0L3Rg9GC0LhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gXCLQlNC+0ZTQtNC90LDRgtC40YHRjFwiO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuLy9zbGlkZXJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzbGlkZXJXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX3dyYXBwZXJcIik7XG4gICAgY29uc3Qgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZXJfX3NsaWRlXCIpO1xuICAgIGNvbnN0IHByZXZCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fYnRuLXByZXZcIik7XG4gICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19idG4tbmV4dFwiKTtcbiAgICBjb25zdCBkb3RzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2RvdHNcIik7XG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IDA7XG4gICAgbGV0IGludGVydmFsO1xuICAgIGxldCB0b3VjaFN0YXJ0WCA9IDA7XG4gICAgbGV0IHRvdWNoRW5kWCA9IDA7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTbGlkZXIoKSB7XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHNsaWRlLnN0eWxlLmRpc3BsYXkgPSBpbmRleCA9PT0gY3VycmVudEluZGV4ID8gXCJmbGV4XCIgOiBcIm5vbmVcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2xpZGVyX19kb3RcIikuZm9yRWFjaCgoZG90LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgZG90LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgaW5kZXggPT09IGN1cnJlbnRJbmRleCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0b3BBdXRvU2xpZGUoKTtcbiAgICAgICAgc3RhcnRBdXRvU2xpZGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0U2xpZGUoKSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChjdXJyZW50SW5kZXggKyAxKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZTbGlkZSgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKGN1cnJlbnRJbmRleCAtIDEgKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0QXV0b1NsaWRlKCkge1xuICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKG5leHRTbGlkZSwgMzAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcEF1dG9TbGlkZSgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydChldmVudCkge1xuICAgICAgICB0b3VjaFN0YXJ0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaEVuZChldmVudCkge1xuICAgICAgICB0b3VjaEVuZFggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICBoYW5kbGVTd2lwZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN3aXBlKCkge1xuICAgICAgICBjb25zdCBzd2lwZVRocmVzaG9sZCA9IDUwO1xuICAgICAgICBpZiAodG91Y2hTdGFydFggLSB0b3VjaEVuZFggPiBzd2lwZVRocmVzaG9sZCkge1xuICAgICAgICAgICAgbmV4dFNsaWRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodG91Y2hFbmRYIC0gdG91Y2hTdGFydFggPiBzd2lwZVRocmVzaG9sZCkge1xuICAgICAgICAgICAgcHJldlNsaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzbGlkZXMuZm9yRWFjaCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgZG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIGRvdC5jbGFzc0xpc3QuYWRkKFwic2xpZGVyX19kb3RcIik7XG4gICAgICAgIGRvdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvdHNDb250YWluZXIuYXBwZW5kQ2hpbGQoZG90KTtcbiAgICB9KTtcblxuICAgIHByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHByZXZTbGlkZSk7XG4gICAgbmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbmV4dFNsaWRlKTtcblxuICAgIC8vIG1vYiBzd2lwZVxuICAgIHNsaWRlcldyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgaGFuZGxlVG91Y2hTdGFydCk7XG4gICAgc2xpZGVyV3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlVG91Y2hFbmQpO1xuXG4gICAgdXBkYXRlU2xpZGVyKCk7XG59KTtcblxuXG4vL2Zvcm1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpOyAgLy8g0JLRgdC1INGE0L7RgNC80Ysg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cbiAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICAgICAgICBjb25zdCBwaG9uZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtcGhvbmUnKTtcbiAgICAgICAgY29uc3QgZGF0ZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtZGF0ZScpO1xuICAgICAgICBjb25zdCByZWdpb25JbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX2lucHV0LXJlZ2lvbicpO1xuICAgICAgICBjb25zdCBjaGVja2JveElucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtY2hlY2tib3gnKTtcbiAgICAgICAgY29uc3QgcmFkaW9JbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJ5ZXMtbm9cIl0nKTsgLy8g0JTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0LLQvtC10L3QvdC+0YHQu9GD0LbQsNGJ0LXQs9C+XG4gICAgICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Ym1pdCcpO1xuICAgICAgICBjb25zdCBhbGxJbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtX19pbnB1dCcpO1xuICAgICAgICBjb25zdCB0ZWxlZ3JhbUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtdGVsZWdyYW0nKTsgLy8g0J3RltC6INCyINGC0LXQu9C10LPRgNCw0LzRllxuICAgICAgICBjb25zdCBmb3JtV2FybmluZyA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTsgIC8vINCa0L7QvdGC0LXQudC90LXRgCDQtNC70Y8g0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQuVxuXG4gICAgICAgIC8vIHRlbGVwaG9uZVxuICAgICAgICBwaG9uZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHBob25lSW5wdXQudmFsdWUudHJpbSgpID09PSAnJykge1xuICAgICAgICAgICAgICAgIHBob25lSW5wdXQudmFsdWUgPSAnKzM4JzsgLy8g0JDQstGC0L7Qt9Cw0L/QvtC70L3QtdC90LjQtSDQv9GA0Lgg0YTQvtC60YPRgdC1XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnKzM4ICcgKyB2YWx1ZS5zbGljZSgyLCA1KSArICcgJyArIHZhbHVlLnNsaWNlKDUsIDgpICsgJyAnICsgdmFsdWUuc2xpY2UoOCwgMTApICsgJyAnICsgdmFsdWUuc2xpY2UoMTAsIDEyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnKzM4JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2lucHV0XG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldElucHV0ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0SW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3YXJuaW5nJykpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZVNpbmdsZUlucHV0KHRhcmdldElucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaXNBbnlJbnB1dEZpbGxlZCA9IEFycmF5LmZyb20oYWxsSW5wdXRzKS5zb21lKGlucHV0ID0+IGlucHV0LnZhbHVlLnRyaW0oKSAhPT0gXCJcIiB8fCBpbnB1dC5jaGVja2VkKTtcbiAgICAgICAgICAgIGlmIChpc0FueUlucHV0RmlsbGVkKSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNoZWNrIDEgaW5wdXRcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVTaW5nbGVJbnB1dChpbnB1dCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwiZGF0ZVwiICYmIGlucHV0LnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudmFsdWUudHJpbSgpID09PSBcIlwiIHx8IChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXBob25lJykgJiYgIS9eXFwrMzhcXHMqXFxkezN9XFxzKlxcZHszfVxccypcXGR7Mn1cXHMqXFxkezJ9JC8udGVzdChpbnB1dC52YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXJlZ2lvbicpICYmIGlucHV0LnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LWNoZWNrYm94JykgJiYgIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmFkaW8nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzUmFkaW9DaGVja2VkID0gQXJyYXkuZnJvbShyYWRpb0lucHV0cykuc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzUmFkaW9DaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LmFkZCgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZGF0aW9uXG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlSW5wdXRzKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBoYXNXYXJuaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGFsbElucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQgPT09IHRlbGVncmFtSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcImRhdGVcIiAmJiBpbnB1dC52YWx1ZSA9PT0gXCIyMDAwLTAxLTAxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudmFsdWUudHJpbSgpID09PSBcIlwiIHx8IChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXBob25lJykgJiYgIS9eXFwrMzhcXHMqXFxkezN9XFxzKlxcZHszfVxccypcXGR7Mn1cXHMqXFxkezJ9JC8udGVzdChpbnB1dC52YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmVnaW9uJykgJiYgaW5wdXQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1jaGVja2JveCcpICYmICFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmFkaW8nKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1JhZGlvQ2hlY2tlZCA9IEFycmF5LmZyb20ocmFkaW9JbnB1dHMpLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSYWRpb0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LmFkZCgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaGFzV2FybmluZykge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZFxuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiAgY2hlY2tWYWxpZCgpe1xuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2FybmluZ1wiKTtcbiAgICAgICAgICAgIHdhcm5pbmdzLmZvckVhY2god2FybmluZyA9PiB3YXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YXJuaW5nXCIpKTsgLy8g0J7Rh9C40YHRgtC40YLQuCDQv9C+0L/QtdGA0LXQtNC90ZYg0L/QvtC80LjQu9C60LhcblxuICAgICAgICAgICAgLy8g0KTRg9C90LrRhtGW0Y8g0LTQu9GPINC00L7QtNCw0LLQsNC90L3RjyDQv9C+0L/QtdGA0LXQtNC20LXQvdC90Y9cbiAgICAgICAgICAgIGNvbnN0IGFkZFdhcm5pbmcgPSAoaW5wdXQsIG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnB1dClcblxuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKFwid2FybmluZ1wiKTtcbiAgICAgICAgICAgICAgICBsZXQgd2FybmluZ01lc3NhZ2UgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKCF3YXJuaW5nTWVzc2FnZSB8fCAhd2FybmluZ01lc3NhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZm9ybV9fd2FybmluZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nTWVzc2FnZS5jbGFzc0xpc3QuYWRkKFwiZm9ybV9fd2FybmluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZ01lc3NhZ2UudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHdhcm5pbmdNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgc3VybmFtZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBmaXJzdE5hbWVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgc2Vjb25kTmFtZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBwaG9uZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBiaXJ0aERhdGVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgaXNNaWxpdGFyeVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBjb25zZW50VmFsaWQgPSBmYWxzZVxuXG5cbiAgICAgICAgICAgIC8vINCS0LDQu9GW0LTQsNGG0ZbRjyDRgtC10LrRgdGC0L7QstC40YUg0L/QvtC70ZbQslxuICAgICAgICAgICAgY29uc3Qgc3VybmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1zdXJuYW1lXCIpO1xuICAgICAgICAgICAgc3VybmFtZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT57XG4gICAgICAgICAgICAgICAgaWYgKCFzdXJuYW1lLnZhbHVlLnRyaW0oKSkgYWRkV2FybmluZyhzdXJuYW1lLCBcItCf0YDRltC30LLQuNGJ0LUg0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmICghc3VybmFtZS52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKHN1cm5hbWUsIFwi0J/RgNGW0LfQstC40YnQtSDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHN1cm5hbWVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlyc3ROYW1lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWZpcnN0LW5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIWZpcnN0TmFtZS52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGZpcnN0TmFtZSwgXCLQhtC8J9GPINC+0LHQvtCyJ9GP0LfQutC+0LLQtVwiKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY29uZE5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtbWlkZGxlLW5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXNlY29uZE5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhzZWNvbmROYW1lLCBcItCf0L4g0LHQsNGC0YzQutC+0LLRliDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2Vjb25kTmFtZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0YLQtdC70LXRhNC+0L3Rg1xuICAgICAgICAgICAgY29uc3QgcGhvbmUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtcGhvbmVcIik7XG4gICAgICAgICAgICBpZiAoIXBob25lLnZhbHVlLnRyaW0oKSB8fCAhL15cXCszOFxccz9cXGR7M31cXHM/XFxkezN9XFxzP1xcZHsyfVxccz9cXGR7Mn0kLy50ZXN0KHBob25lLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcocGhvbmUsIFwi0J3QvtC80LXRgCDRgtC10LvQtdGE0L7QvdGDINC+0LHQvtCyJ9GP0LfQutC+0LLQuNC5XCIpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBwaG9uZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0LTQsNGC0Lgg0L3QsNGA0L7QtNC20LXQvdC90Y9cbiAgICAgICAgICAgIGNvbnN0IGJpcnRoRGF0ZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1kYXRlXCIpO1xuICAgICAgICAgICAgaWYgKCFiaXJ0aERhdGUudmFsdWUgfHwgYmlydGhEYXRlLnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoYmlydGhEYXRlLCBcItCU0LDRgtCwINC90LDRgNC+0LTQttC10L3QvdGPINC+0LHQvtCyJ9GP0LfQutC+0LLQsFwiKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0LLRltC50YHRjNC60L7QstC+0YHQu9GD0LbQsdC+0LLRhtGPXG4gICAgICAgICAgICBjb25zdCBpc01pbGl0YXJ5ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXJhZGlvOmNoZWNrZWRcIik7XG4gICAgICAgICAgICBpZiAoIWlzTWlsaXRhcnkpe1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX3JhZGlvLWdyb3VwXCIpLCBcItCe0LHQtdGA0ZbRgtGMINCy0LDRgNGW0LDQvdGCXCIpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIGlzTWlsaXRhcnlWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINC30LPQvtC00Lgg0L3QsCDQvtCx0YDQvtCx0LrRgyDQtNCw0L3QuNGFXG4gICAgICAgICAgICBjb25zdCBjb25zZW50ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWNoZWNrYm94XCIpO1xuICAgICAgICAgICAgaWYgKCFjb25zZW50LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGNvbnNlbnQsIFwi0JLQuCDQv9C+0LLQuNC90L3RliDQv9C+0LPQvtC00LjRgtC40YHRjyDQtyDQvtCx0YDQvtCx0LrQvtGOINC00LDQvdC40YVcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zZW50VmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdXJuYW1lVmFsaWQgJiYgZmlyc3ROYW1lVmFsaWQgJiYgc2Vjb25kTmFtZVZhbGlkICYmIHBob25lVmFsaWQgJiYgYmlydGhEYXRlVmFsaWQgJiYgaXNNaWxpdGFyeVZhbGlkICYmIGNvbnNlbnRWYWxpZCl7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZFxuICAgICAgICB9XG5cblxuICAgICAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICAgICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vINCX0LDQsdC70L7QutGD0LLQsNGC0Lgg0YHRgtCw0L3QtNCw0YDRgtC90YMg0LLRltC00L/RgNCw0LLQutGDXG4gICAgICAgICAgICAgICAgLy8gdmFsaWRhdGVJbnB1dHMoZm9ybSlcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGNoZWNrVmFsaWQoKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlzVmFsaWQpXG5cblxuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZHNhZFwiKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTsgLy9cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmZXRjaChmb3JtLmFjdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTsgLy8g0JLQuNCy0LXRgdGC0Lgg0LLRltC00L/QvtCy0ZbQtNGMINCy0ZbQtCDRgdC10YDQstC10YDQsFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc01lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fd2FybmluZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaW5jbHVkZXMoXCLQlNGP0LrRg9GU0LzQviDQt9CwINCy0LDRiNGDINC30LDRj9Cy0LrRgyFcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INGD0YHQv9GW0YVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpOyAvLyDQntGH0LjRgdGC0LjRgtC4INGE0L7RgNC80YNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INC/0L7QvNC40LvQutGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwi0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0ZbQtNC/0YDQsNCy0YbRliDRhNC+0YDQvNC4LiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuDpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwi0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0ZbQtNC/0YDQsNCy0YbRliDRhNC+0YDQvNC4LiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG59KTtcblxuXG5cblxuXG4iXX0=
