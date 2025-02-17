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
              // if (errorMessage) {
              //     errorMessage.textContent = "Помилка при відправці форми. Спробуйте ще раз.";
              //     errorMessage.classList.add('visible');
              // }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kYWxPdmVybGF5cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvcGVuTW9kYWxCdG5zIiwibGVuZ3RoIiwiY29uc29sZSIsImVycm9yIiwiZm9yRWFjaCIsImJ0biIsIm1vZGFsIiwic3R5bGUiLCJkaXNwbGF5IiwiZWxlbWVudHMiLCJjaGVja1Zpc2liaWxpdHkiLCJlbCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImNsYXNzTGlzdCIsImFkZCIsInF1ZXJ5U2VsZWN0b3IiLCJmb3JtIiwidGV4dENvbnRlbnQiLCJzbGlkZXJXcmFwcGVyIiwic2xpZGVzIiwicHJldkJ0biIsIm5leHRCdG4iLCJkb3RzQ29udGFpbmVyIiwiY3VycmVudEluZGV4IiwiaW50ZXJ2YWwiLCJ0b3VjaFN0YXJ0WCIsInRvdWNoRW5kWCIsInVwZGF0ZVNsaWRlciIsInNsaWRlIiwiaW5kZXgiLCJyZW1vdmUiLCJjb25jYXQiLCJkb3QiLCJ0b2dnbGUiLCJzdG9wQXV0b1NsaWRlIiwic3RhcnRBdXRvU2xpZGUiLCJuZXh0U2xpZGUiLCJwcmV2U2xpZGUiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJoYW5kbGVUb3VjaFN0YXJ0IiwiZXZlbnQiLCJ0b3VjaGVzIiwiY2xpZW50WCIsImhhbmRsZVRvdWNoRW5kIiwiY2hhbmdlZFRvdWNoZXMiLCJoYW5kbGVTd2lwZSIsInN3aXBlVGhyZXNob2xkIiwiXyIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImZvcm1zIiwicGhvbmVJbnB1dCIsImRhdGVJbnB1dCIsInJlZ2lvbklucHV0IiwiY2hlY2tib3hJbnB1dCIsInJhZGlvSW5wdXRzIiwic3VibWl0QnV0dG9uIiwiYWxsSW5wdXRzIiwidGVsZWdyYW1JbnB1dCIsImZvcm1XYXJuaW5nIiwidmFsdWUiLCJ0cmltIiwicmVwbGFjZSIsInNsaWNlIiwidGFyZ2V0SW5wdXQiLCJ0YXJnZXQiLCJjb250YWlucyIsInZhbGlkYXRlU2luZ2xlSW5wdXQiLCJpc0FueUlucHV0RmlsbGVkIiwiQXJyYXkiLCJmcm9tIiwic29tZSIsImlucHV0IiwiY2hlY2tlZCIsInR5cGUiLCJ0ZXN0IiwiaXNSYWRpb0NoZWNrZWQiLCJyYWRpbyIsInZhbGlkYXRlSW5wdXRzIiwiaXNWYWxpZCIsImhhc1dhcm5pbmciLCJjaGVja1ZhbGlkIiwid2FybmluZ3MiLCJ3YXJuaW5nIiwiYWRkV2FybmluZyIsIm1lc3NhZ2UiLCJ3YXJuaW5nTWVzc2FnZSIsIm5leHRFbGVtZW50U2libGluZyIsInBhcmVudE5vZGUiLCJzdXJuYW1lVmFsaWQiLCJmaXJzdE5hbWVWYWxpZCIsInNlY29uZE5hbWVWYWxpZCIsInBob25lVmFsaWQiLCJiaXJ0aERhdGVWYWxpZCIsImlzTWlsaXRhcnlWYWxpZCIsImNvbnNlbnRWYWxpZCIsInN1cm5hbWUiLCJmaXJzdE5hbWUiLCJzZWNvbmROYW1lIiwicGhvbmUiLCJiaXJ0aERhdGUiLCJpc01pbGl0YXJ5IiwiY29uc2VudCIsInByZXZlbnREZWZhdWx0IiwibG9nIiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsInN1Y2Nlc3NNZXNzYWdlIiwic2V0VGltZW91dCIsInJlc2V0IiwiZmV0Y2giLCJhY3Rpb24iLCJtZXRob2QiLCJib2R5IiwidGhlbiIsInJlc3BvbnNlIiwidGV4dCIsImRhdGEiLCJlcnJvck1lc3NhZ2UiLCJpbmNsdWRlcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxRQUFRLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVc7RUFDckQsSUFBTUMsYUFBYSxHQUFHRixRQUFRLENBQUNHLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO0VBQ2pFLElBQU1DLGFBQWEsR0FBR0osUUFBUSxDQUFDRyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7RUFFNUQsSUFBSUQsYUFBYSxDQUFDRyxNQUFNLEtBQUss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QUssQ0FBQztZQUNwRCxJQUFNd0gsWUFBWSxHQUFHdkcsSUFBSSxDQUFDRCxhQUFhLENBQUMsZ0JBQWdCLENBQUM7WUFDekQsSUFBSXdHLFlBQVksRUFBRTtjQUNkQSxZQUFZLENBQUN0RyxXQUFXLEdBQUcsZ0RBQWdEO2NBQzNFc0csWUFBWSxDQUFDMUcsU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQ3pDO1VBQ0osQ0FBQyxDQUFDO1FBQ1Y7TUFDSixDQUFDLENBQUM7SUFDTixDQUFDLENBQUM7RUFFTixDQUFDLENBQUM7QUFDTixDQUFDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vYnV0dG9uIGZvciBURVNUXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kYWxPdmVybGF5cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgY29uc3Qgb3Blbk1vZGFsQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kYXJrLWJ0bicpO1xuXG4gICAgaWYgKG1vZGFsT3ZlcmxheXMubGVuZ3RoID09PSAwIHx8IG9wZW5Nb2RhbEJ0bnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLQldC70LXQvNC10L3RgtC4INC90LUg0LfQvdCw0LnQtNC10L3QviFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcGVuTW9kYWxCdG5zLmZvckVhY2goYnRuID0+IHtcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtb2RhbE92ZXJsYXlzLmZvckVhY2gobW9kYWwgPT4ge1xuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7IC8vINCS0ZbQtNC60YDQuNCy0LDRlCDQstGB0ZYgLmZvcm1fX3N1Y2Nlc3NcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIG1vZGFsT3ZlcmxheXMuZm9yRWFjaChtb2RhbCA9PiB7XG4gICAgICAgIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbi8vZmFkZS1pbiB3aGVuIHZpc2libGVcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmFkZS1pbiwgLnNsaWRlSW5MZWZ0LCAuc2xpZGVJblJpZ2h0LCAuZmFkZUluRnJvbVRvcFwiKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrVmlzaWJpbGl0eSgpIHtcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBpZiAocmVjdC50b3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjkpIHtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgY2hlY2tWaXNpYmlsaXR5KTtcbiAgICBjaGVja1Zpc2liaWxpdHkoKTtcbn0pO1xuXG4vL29wZW4gZm9ybSBibG9ja1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGVhZGVyX19jb250ZW50LWJ0blwiKTtcbiAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5maXJzdEZvcm1cIik7XG5cbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGZvcm0uc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgfHwgZm9ybS5zdHlsZS5kaXNwbGF5ID09PSBcIlwiKSB7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICBidG4udGV4dENvbnRlbnQgPSBcItCX0LPQvtGA0L3Rg9GC0LhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gXCLQlNC+0ZTQtNC90LDRgtC40YHRjFwiO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuLy9zbGlkZXJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzbGlkZXJXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX3dyYXBwZXJcIik7XG4gICAgY29uc3Qgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZXJfX3NsaWRlXCIpO1xuICAgIGNvbnN0IHByZXZCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fYnRuLXByZXZcIik7XG4gICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19idG4tbmV4dFwiKTtcbiAgICBjb25zdCBkb3RzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2RvdHNcIik7XG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IDA7XG4gICAgbGV0IGludGVydmFsO1xuICAgIGxldCB0b3VjaFN0YXJ0WCA9IDA7XG4gICAgbGV0IHRvdWNoRW5kWCA9IDA7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTbGlkZXIoKSB7XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIiwgXCJvcGFjaXR5XCIpXG4gICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QuYWRkKGAke2luZGV4ID09PSBjdXJyZW50SW5kZXggPyBcImFjdGl2ZVwiIDogXCJvcGFjaXR5XCJ9YClcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2xpZGVyX19kb3RcIikuZm9yRWFjaCgoZG90LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgZG90LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgaW5kZXggPT09IGN1cnJlbnRJbmRleCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0b3BBdXRvU2xpZGUoKTtcbiAgICAgICAgc3RhcnRBdXRvU2xpZGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXh0U2xpZGUoKSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChjdXJyZW50SW5kZXggKyAxKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZTbGlkZSgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKGN1cnJlbnRJbmRleCAtIDEgKyBzbGlkZXMubGVuZ3RoKSAlIHNsaWRlcy5sZW5ndGg7XG4gICAgICAgIHVwZGF0ZVNsaWRlcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0QXV0b1NsaWRlKCkge1xuICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKG5leHRTbGlkZSwgMzAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcEF1dG9TbGlkZSgpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydChldmVudCkge1xuICAgICAgICB0b3VjaFN0YXJ0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaEVuZChldmVudCkge1xuICAgICAgICB0b3VjaEVuZFggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICBoYW5kbGVTd2lwZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN3aXBlKCkge1xuICAgICAgICBjb25zdCBzd2lwZVRocmVzaG9sZCA9IDUwO1xuICAgICAgICBpZiAodG91Y2hTdGFydFggLSB0b3VjaEVuZFggPiBzd2lwZVRocmVzaG9sZCkge1xuICAgICAgICAgICAgbmV4dFNsaWRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodG91Y2hFbmRYIC0gdG91Y2hTdGFydFggPiBzd2lwZVRocmVzaG9sZCkge1xuICAgICAgICAgICAgcHJldlNsaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzbGlkZXMuZm9yRWFjaCgoXywgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgZG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgIGRvdC5jbGFzc0xpc3QuYWRkKFwic2xpZGVyX19kb3RcIik7XG4gICAgICAgIGRvdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvdHNDb250YWluZXIuYXBwZW5kQ2hpbGQoZG90KTtcbiAgICB9KTtcblxuICAgIHByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHByZXZTbGlkZSk7XG4gICAgbmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbmV4dFNsaWRlKTtcblxuICAgIC8vIG1vYiBzd2lwZVxuICAgIHNsaWRlcldyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgaGFuZGxlVG91Y2hTdGFydCk7XG4gICAgc2xpZGVyV3JhcHBlci5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlVG91Y2hFbmQpO1xuXG4gICAgdXBkYXRlU2xpZGVyKCk7XG59KTtcblxuXG4vL2Zvcm1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpOyAgLy8g0JLRgdC1INGE0L7RgNC80Ysg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cbiAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICAgICAgICBjb25zdCBwaG9uZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtcGhvbmUnKTtcbiAgICAgICAgY29uc3QgZGF0ZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtZGF0ZScpO1xuICAgICAgICBjb25zdCByZWdpb25JbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX2lucHV0LXJlZ2lvbicpO1xuICAgICAgICBjb25zdCBjaGVja2JveElucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtY2hlY2tib3gnKTtcbiAgICAgICAgY29uc3QgcmFkaW9JbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9XCJ5ZXMtbm9cIl0nKTsgLy8g0JTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0LLQvtC10L3QvdC+0YHQu9GD0LbQsNGJ0LXQs9C+XG4gICAgICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Ym1pdCcpO1xuICAgICAgICBjb25zdCBhbGxJbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtX19pbnB1dCcpO1xuICAgICAgICBjb25zdCB0ZWxlZ3JhbUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtdGVsZWdyYW0nKTsgLy8g0J3RltC6INCyINGC0LXQu9C10LPRgNCw0LzRllxuICAgICAgICBjb25zdCBmb3JtV2FybmluZyA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTsgIC8vINCa0L7QvdGC0LXQudC90LXRgCDQtNC70Y8g0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQuVxuXG4gICAgICAgIC8vIHRlbGVwaG9uZVxuICAgICAgICBwaG9uZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHBob25lSW5wdXQudmFsdWUudHJpbSgpID09PSAnJykge1xuICAgICAgICAgICAgICAgIHBob25lSW5wdXQudmFsdWUgPSAnKzM4JzsgLy8g0JDQstGC0L7Qt9Cw0L/QvtC70L3QtdC90LjQtSDQv9GA0Lgg0YTQvtC60YPRgdC1XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnKzM4ICcgKyB2YWx1ZS5zbGljZSgyLCA1KSArICcgJyArIHZhbHVlLnNsaWNlKDUsIDgpICsgJyAnICsgdmFsdWUuc2xpY2UoOCwgMTApICsgJyAnICsgdmFsdWUuc2xpY2UoMTAsIDEyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnKzM4JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2lucHV0XG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldElucHV0ID0gZXZlbnQudGFyZ2V0O1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0SW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3YXJuaW5nJykpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZVNpbmdsZUlucHV0KHRhcmdldElucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaXNBbnlJbnB1dEZpbGxlZCA9IEFycmF5LmZyb20oYWxsSW5wdXRzKS5zb21lKGlucHV0ID0+IGlucHV0LnZhbHVlLnRyaW0oKSAhPT0gXCJcIiB8fCBpbnB1dC5jaGVja2VkKTtcbiAgICAgICAgICAgIGlmIChpc0FueUlucHV0RmlsbGVkKSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGNoZWNrIDEgaW5wdXRcbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVTaW5nbGVJbnB1dChpbnB1dCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwiZGF0ZVwiICYmIGlucHV0LnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudmFsdWUudHJpbSgpID09PSBcIlwiIHx8IChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXBob25lJykgJiYgIS9eXFwrMzhcXHMqXFxkezN9XFxzKlxcZHszfVxccypcXGR7Mn1cXHMqXFxkezJ9JC8udGVzdChpbnB1dC52YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXJlZ2lvbicpICYmIGlucHV0LnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LWNoZWNrYm94JykgJiYgIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmFkaW8nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzUmFkaW9DaGVja2VkID0gQXJyYXkuZnJvbShyYWRpb0lucHV0cykuc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzUmFkaW9DaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LmFkZCgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZGF0aW9uXG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlSW5wdXRzKGZvcm0pIHtcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBoYXNXYXJuaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGFsbElucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQgPT09IHRlbGVncmFtSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcImRhdGVcIiAmJiBpbnB1dC52YWx1ZSA9PT0gXCIyMDAwLTAxLTAxXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQudmFsdWUudHJpbSgpID09PSBcIlwiIHx8IChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXBob25lJykgJiYgIS9eXFwrMzhcXHMqXFxkezN9XFxzKlxcZHszfVxccypcXGR7Mn1cXHMqXFxkezJ9JC8udGVzdChpbnB1dC52YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmVnaW9uJykgJiYgaW5wdXQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1jaGVja2JveCcpICYmICFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmFkaW8nKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1JhZGlvQ2hlY2tlZCA9IEFycmF5LmZyb20ocmFkaW9JbnB1dHMpLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNSYWRpb0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LmFkZCgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaGFzV2FybmluZykge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZFxuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiAgY2hlY2tWYWxpZCgpe1xuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgY29uc3Qgd2FybmluZ3MgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2FybmluZ1wiKTtcbiAgICAgICAgICAgIHdhcm5pbmdzLmZvckVhY2god2FybmluZyA9PiB3YXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoXCJ3YXJuaW5nXCIpKTsgLy8g0J7Rh9C40YHRgtC40YLQuCDQv9C+0L/QtdGA0LXQtNC90ZYg0L/QvtC80LjQu9C60LhcblxuICAgICAgICAgICAgLy8g0KTRg9C90LrRhtGW0Y8g0LTQu9GPINC00L7QtNCw0LLQsNC90L3RjyDQv9C+0L/QtdGA0LXQtNC20LXQvdC90Y9cbiAgICAgICAgICAgIGNvbnN0IGFkZFdhcm5pbmcgPSAoaW5wdXQsIG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbnB1dClcblxuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKFwid2FybmluZ1wiKTtcbiAgICAgICAgICAgICAgICBsZXQgd2FybmluZ01lc3NhZ2UgPSBpbnB1dC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKCF3YXJuaW5nTWVzc2FnZSB8fCAhd2FybmluZ01lc3NhZ2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZm9ybV9fd2FybmluZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nTWVzc2FnZS5jbGFzc0xpc3QuYWRkKFwiZm9ybV9fd2FybmluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZ01lc3NhZ2UudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHdhcm5pbmdNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgc3VybmFtZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBmaXJzdE5hbWVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgc2Vjb25kTmFtZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBwaG9uZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBiaXJ0aERhdGVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgaXNNaWxpdGFyeVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBjb25zZW50VmFsaWQgPSBmYWxzZVxuXG5cbiAgICAgICAgICAgIGNvbnN0IHN1cm5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtc3VybmFtZVwiKTtcbiAgICAgICAgICAgIHN1cm5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+e1xuICAgICAgICAgICAgICAgIGlmICghc3VybmFtZS52YWx1ZS50cmltKCkpIGFkZFdhcm5pbmcoc3VybmFtZSwgXCLQn9GA0ZbQt9Cy0LjRidC1INC+0LHQvtCyJ9GP0LfQutC+0LLQtVwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoIXN1cm5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhzdXJuYW1lLCBcItCf0YDRltC30LLQuNGJ0LUg0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzdXJuYW1lVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0TmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1maXJzdC1uYW1lXCIpO1xuICAgICAgICAgICAgaWYgKCFmaXJzdE5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhmaXJzdE5hbWUsIFwi0IbQvCfRjyDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGZpcnN0TmFtZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzZWNvbmROYW1lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LW1pZGRsZS1uYW1lXCIpO1xuICAgICAgICAgICAgaWYgKCFzZWNvbmROYW1lLnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoc2Vjb25kTmFtZSwgXCLQn9C+INCx0LDRgtGM0LrQvtCy0ZYg0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuXG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNlY29uZE5hbWVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINGC0LXQu9C10YTQvtC90YNcbiAgICAgICAgICAgIGNvbnN0IHBob25lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXBob25lXCIpO1xuICAgICAgICAgICAgaWYgKCFwaG9uZS52YWx1ZS50cmltKCkgfHwgIS9eXFwrMzhcXHM/XFxkezN9XFxzP1xcZHszfVxccz9cXGR7Mn1cXHM/XFxkezJ9JC8udGVzdChwaG9uZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKHBob25lLCBcItCd0L7QvNC10YAg0YLQtdC70LXRhNC+0L3RgyDQvtCx0L7QsifRj9C30LrQvtCy0LjQuVwiKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcGhvbmVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINC00LDRgtC4INC90LDRgNC+0LTQttC10L3QvdGPXG4gICAgICAgICAgICBjb25zdCBiaXJ0aERhdGUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtZGF0ZVwiKTtcbiAgICAgICAgICAgIGlmICghYmlydGhEYXRlLnZhbHVlIHx8IGJpcnRoRGF0ZS52YWx1ZSA9PT0gXCIyMDAwLTAxLTAxXCIpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGJpcnRoRGF0ZSwgXCLQlNCw0YLQsCDQvdCw0YDQvtC00LbQtdC90L3RjyDQvtCx0L7QsifRj9C30LrQvtCy0LBcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINCy0ZbQudGB0YzQutC+0LLQvtGB0LvRg9C20LHQvtCy0YbRj1xuICAgICAgICAgICAgY29uc3QgaXNNaWxpdGFyeSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1yYWRpbzpjaGVja2VkXCIpO1xuICAgICAgICAgICAgaWYgKCFpc01pbGl0YXJ5KXtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19yYWRpby1ncm91cFwiKSwgXCLQntCx0LXRgNGW0YLRjCDQstCw0YDRltCw0L3RglwiKTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBpc01pbGl0YXJ5VmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCS0LDQu9GW0LTQsNGG0ZbRjyDQt9Cz0L7QtNC4INC90LAg0L7QsdGA0L7QsdC60YMg0LTQsNC90LjRhVxuICAgICAgICAgICAgY29uc3QgY29uc2VudCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1jaGVja2JveFwiKTtcbiAgICAgICAgICAgIGlmICghY29uc2VudC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhjb25zZW50LCBcItCS0Lgg0L/QvtCy0LjQvdC90ZYg0L/QvtCz0L7QtNC40YLQuNGB0Y8g0Lcg0L7QsdGA0L7QsdC60L7RjiDQtNCw0L3QuNGFXCIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY29uc2VudFZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3VybmFtZVZhbGlkICYmIGZpcnN0TmFtZVZhbGlkICYmIHNlY29uZE5hbWVWYWxpZCAmJiBwaG9uZVZhbGlkICYmIGJpcnRoRGF0ZVZhbGlkICYmIGlzTWlsaXRhcnlWYWxpZCAmJiBjb25zZW50VmFsaWQpe1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWRcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IHtcbiAgICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDQl9Cw0LHQu9C+0LrRg9Cy0LDRgtC4INGB0YLQsNC90LTQsNGA0YLQvdGDINCy0ZbQtNC/0YDQsNCy0LrRg1xuICAgICAgICAgICAgICAgIC8vIHZhbGlkYXRlSW5wdXRzKGZvcm0pXG4gICAgICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSBjaGVja1ZhbGlkKClcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpc1ZhbGlkKVxuXG5cbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRzYWRcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7IC8vXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc01lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goZm9ybS5hY3Rpb24sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7IC8vINCS0LjQstC10YHRgtC4INCy0ZbQtNC/0L7QstGW0LTRjCDQstGW0LQg0YHQtdGA0LLQtdGA0LBcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmluY2x1ZGVzKFwi0JTRj9C60YPRlNC80L4g0LfQsCDQstCw0YjRgyDQt9Cw0Y/QstC60YMhXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0L7QutCw0LfQsNGC0Lgg0L/QvtCy0ZbQtNC+0LzQu9C10L3QvdGPINC/0YDQviDRg9GB0L/RltGFXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTsgLy8g0J7Rh9C40YHRgtC40YLQuCDRhNC+0YDQvNGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0L7QutCw0LfQsNGC0Lgg0L/QvtCy0ZbQtNC+0LzQu9C10L3QvdGPINC/0YDQviDQv9C+0LzQuNC70LrRg1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuC4g0KHQv9GA0L7QsdGD0LnRgtC1INGJ0LUg0YDQsNC3LlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgZXJyb3JNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCLQn9C+0LzQuNC70LrQsCDQv9GA0Lgg0LLRltC00L/RgNCw0LLRhtGWINGE0L7RgNC80Lg6XCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX193YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuC4g0KHQv9GA0L7QsdGD0LnRgtC1INGJ0LUg0YDQsNC3LlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xufSk7XG5cblxuXG5cblxuIl19
