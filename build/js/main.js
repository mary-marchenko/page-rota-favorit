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
    phoneInput.addEventListener('input', function (e) {
      var value = this.value.replace(/\D/g, '');
      if (e.inputType === "deleteContentBackward" && this.value.endsWith(" ")) {
        this.value = this.value.slice(0, -1);
        return;
      }
      if (value.length > 1) {
        value = '+38 ' + value.slice(2, 5).trim() + ' ' + value.slice(5, 8).trim() + ' ' + value.slice(8, 10).trim() + ' ' + value.slice(10, 12).trim();
      } else {
        value = '+38';
      }
      this.value = value.replace(/\s+/g, ' ').trim();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kYWxPdmVybGF5cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvcGVuTW9kYWxCdG5zIiwibGVuZ3RoIiwiY29uc29sZSIsImVycm9yIiwiZm9yRWFjaCIsImJ0biIsIm1vZGFsIiwic3R5bGUiLCJkaXNwbGF5IiwiZWxlbWVudHMiLCJjaGVja1Zpc2liaWxpdHkiLCJlbCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImNsYXNzTGlzdCIsImFkZCIsInF1ZXJ5U2VsZWN0b3IiLCJmb3JtIiwidGV4dENvbnRlbnQiLCJzbGlkZXJXcmFwcGVyIiwic2xpZGVzIiwicHJldkJ0biIsIm5leHRCdG4iLCJkb3RzQ29udGFpbmVyIiwiY3VycmVudEluZGV4IiwiaW50ZXJ2YWwiLCJ0b3VjaFN0YXJ0WCIsInRvdWNoRW5kWCIsInVwZGF0ZVNsaWRlciIsInNsaWRlIiwiaW5kZXgiLCJyZW1vdmUiLCJjb25jYXQiLCJkb3QiLCJ0b2dnbGUiLCJzdG9wQXV0b1NsaWRlIiwic3RhcnRBdXRvU2xpZGUiLCJuZXh0U2xpZGUiLCJwcmV2U2xpZGUiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJoYW5kbGVUb3VjaFN0YXJ0IiwiZXZlbnQiLCJ0b3VjaGVzIiwiY2xpZW50WCIsImhhbmRsZVRvdWNoRW5kIiwiY2hhbmdlZFRvdWNoZXMiLCJoYW5kbGVTd2lwZSIsInN3aXBlVGhyZXNob2xkIiwiXyIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImZvcm1zIiwicGhvbmVJbnB1dCIsImRhdGVJbnB1dCIsInJlZ2lvbklucHV0IiwiY2hlY2tib3hJbnB1dCIsInJhZGlvSW5wdXRzIiwic3VibWl0QnV0dG9uIiwiYWxsSW5wdXRzIiwidGVsZWdyYW1JbnB1dCIsImZvcm1XYXJuaW5nIiwidmFsdWUiLCJ0cmltIiwiZSIsInJlcGxhY2UiLCJpbnB1dFR5cGUiLCJlbmRzV2l0aCIsInNsaWNlIiwicGFydHMiLCJzcGxpdCIsImpvaW4iLCJ0YXJnZXRJbnB1dCIsInRhcmdldCIsImNvbnRhaW5zIiwidmFsaWRhdGVTaW5nbGVJbnB1dCIsImlzQW55SW5wdXRGaWxsZWQiLCJBcnJheSIsImZyb20iLCJzb21lIiwiaW5wdXQiLCJjaGVja2VkIiwidHlwZSIsInRlc3QiLCJpc1JhZGlvQ2hlY2tlZCIsInJhZGlvIiwidmFsaWRhdGVJbnB1dHMiLCJpc1ZhbGlkIiwiaGFzV2FybmluZyIsImNoZWNrVmFsaWQiLCJ3YXJuaW5ncyIsIndhcm5pbmciLCJhZGRXYXJuaW5nIiwibWVzc2FnZSIsIndhcm5pbmdNZXNzYWdlIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwicGFyZW50Tm9kZSIsInN1cm5hbWVWYWxpZCIsImZpcnN0TmFtZVZhbGlkIiwic2Vjb25kTmFtZVZhbGlkIiwicGhvbmVWYWxpZCIsImJpcnRoRGF0ZVZhbGlkIiwiaXNNaWxpdGFyeVZhbGlkIiwiY29uc2VudFZhbGlkIiwic3VybmFtZSIsImZpcnN0TmFtZSIsInNlY29uZE5hbWUiLCJwaG9uZSIsImJpcnRoRGF0ZSIsImlzTWlsaXRhcnkiLCJjb25zZW50IiwicHJldmVudERlZmF1bHQiLCJsb2ciLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwic3VjY2Vzc01lc3NhZ2UiLCJzZXRUaW1lb3V0IiwicmVzZXQiLCJmZXRjaCIsImFjdGlvbiIsIm1ldGhvZCIsImJvZHkiLCJ0aGVuIiwicmVzcG9uc2UiLCJ0ZXh0IiwiZGF0YSIsImVycm9yTWVzc2FnZSIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0FBLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBVztFQUNyRCxJQUFNQyxhQUFhLEdBQUdGLFFBQVEsQ0FBQ0csZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7RUFDakUsSUFBTUMsYUFBYSxHQUFHSixRQUFRLENBQUNHLGdCQUFn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LGdEQUFnRDtjQUMzRTRHLFlBQVksQ0FBQ2hILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUN6QztVQUNKLENBQUMsQ0FBQztRQUNWO01BQ0osQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0VBRU4sQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2J1dHRvbiBmb3IgVEVTVFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGFsT3ZlcmxheXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybV9fc3VjY2VzcycpO1xuICAgIGNvbnN0IG9wZW5Nb2RhbEJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGFyay1idG4nKTtcblxuICAgIGlmIChtb2RhbE92ZXJsYXlzLmxlbmd0aCA9PT0gMCB8fCBvcGVuTW9kYWxCdG5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi0JXQu9C10LzQtdC90YLQuCDQvdC1INC30L3QsNC50LTQtdC90L4hXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3Blbk1vZGFsQnRucy5mb3JFYWNoKGJ0biA9PiB7XG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbW9kYWxPdmVybGF5cy5mb3JFYWNoKG1vZGFsID0+IHtcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnOyAvLyDQktGW0LTQutGA0LjQstCw0ZQg0LLRgdGWIC5mb3JtX19zdWNjZXNzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBtb2RhbE92ZXJsYXlzLmZvckVhY2gobW9kYWwgPT4ge1xuICAgICAgICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG4vL2ZhZGUtaW4gd2hlbiB2aXNpYmxlXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZhZGUtaW4sIC5zbGlkZUluTGVmdCwgLnNsaWRlSW5SaWdodCwgLmZhZGVJbkZyb21Ub3BcIik7XG5cbiAgICBmdW5jdGlvbiBjaGVja1Zpc2liaWxpdHkoKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgaWYgKHJlY3QudG9wIDwgd2luZG93LmlubmVySGVpZ2h0ICogMC45KSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGNoZWNrVmlzaWJpbGl0eSk7XG4gICAgY2hlY2tWaXNpYmlsaXR5KCk7XG59KTtcblxuLy9vcGVuIGZvcm0gYmxvY2tcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhlYWRlcl9fY29udGVudC1idG5cIik7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlyc3RGb3JtXCIpO1xuXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmb3JtLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiIHx8IGZvcm0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIikge1xuICAgICAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gXCLQl9Cz0L7RgNC90YPRgtC4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IFwi0JTQvtGU0LTQvdCw0YLQuNGB0YxcIjtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbi8vc2xpZGVyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2xpZGVyV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX193cmFwcGVyXCIpO1xuICAgIGNvbnN0IHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2xpZGVyX19zbGlkZVwiKTtcbiAgICBjb25zdCBwcmV2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2J0bi1wcmV2XCIpO1xuICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fYnRuLW5leHRcIik7XG4gICAgY29uc3QgZG90c0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19kb3RzXCIpO1xuICAgIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICAgIGxldCBpbnRlcnZhbDtcbiAgICBsZXQgdG91Y2hTdGFydFggPSAwO1xuICAgIGxldCB0b3VjaEVuZFggPSAwO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCkge1xuICAgICAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIsIFwib3BhY2l0eVwiKVxuICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LmFkZChgJHtpbmRleCA9PT0gY3VycmVudEluZGV4ID8gXCJhY3RpdmVcIiA6IFwib3BhY2l0eVwifWApXG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNsaWRlcl9fZG90XCIpLmZvckVhY2goKGRvdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGRvdC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIGluZGV4ID09PSBjdXJyZW50SW5kZXgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdG9wQXV0b1NsaWRlKCk7XG4gICAgICAgIHN0YXJ0QXV0b1NsaWRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV4dFNsaWRlKCkge1xuICAgICAgICBjdXJyZW50SW5kZXggPSAoY3VycmVudEluZGV4ICsgMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2U2xpZGUoKSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChjdXJyZW50SW5kZXggLSAxICsgc2xpZGVzLmxlbmd0aCkgJSBzbGlkZXMubGVuZ3RoO1xuICAgICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydEF1dG9TbGlkZSgpIHtcbiAgICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChuZXh0U2xpZGUsIDMwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3BBdXRvU2xpZGUoKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgdG91Y2hTdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hFbmQoZXZlbnQpIHtcbiAgICAgICAgdG91Y2hFbmRYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgaGFuZGxlU3dpcGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTd2lwZSgpIHtcbiAgICAgICAgY29uc3Qgc3dpcGVUaHJlc2hvbGQgPSA1MDtcbiAgICAgICAgaWYgKHRvdWNoU3RhcnRYIC0gdG91Y2hFbmRYID4gc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIG5leHRTbGlkZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRvdWNoRW5kWCAtIHRvdWNoU3RhcnRYID4gc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIHByZXZTbGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2xpZGVzLmZvckVhY2goKF8sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBkb3QuY2xhc3NMaXN0LmFkZChcInNsaWRlcl9fZG90XCIpO1xuICAgICAgICBkb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb3RzQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgfSk7XG5cbiAgICBwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2U2xpZGUpO1xuICAgIG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5leHRTbGlkZSk7XG5cbiAgICAvLyBtb2Igc3dpcGVcbiAgICBzbGlkZXJXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGhhbmRsZVRvdWNoU3RhcnQpO1xuICAgIHNsaWRlcldyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZVRvdWNoRW5kKTtcblxuICAgIHVwZGF0ZVNsaWRlcigpO1xufSk7XG5cblxuLy9mb3JtXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJyk7ICAvLyDQktGB0LUg0YTQvtGA0LzRiyDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblxuICAgIGZvcm1zLmZvckVhY2goZm9ybSA9PiB7XG4gICAgICAgIGNvbnN0IHBob25lSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1waG9uZScpO1xuICAgICAgICBjb25zdCBkYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1kYXRlJyk7XG4gICAgICAgIGNvbnN0IHJlZ2lvbklucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtcmVnaW9uJyk7XG4gICAgICAgIGNvbnN0IGNoZWNrYm94SW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1jaGVja2JveCcpO1xuICAgICAgICBjb25zdCByYWRpb0lucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInllcy1ub1wiXScpOyAvLyDQlNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQstC+0LXQvdC90L7RgdC70YPQttCw0YnQtdCz0L5cbiAgICAgICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fc3VibWl0Jyk7XG4gICAgICAgIGNvbnN0IGFsbElucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmZvcm1fX2lucHV0Jyk7XG4gICAgICAgIGNvbnN0IHRlbGVncmFtSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC10ZWxlZ3JhbScpOyAvLyDQndGW0Log0LIg0YLQtdC70LXQs9GA0LDQvNGWXG4gICAgICAgIGNvbnN0IGZvcm1XYXJuaW5nID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fd2FybmluZycpOyAgLy8g0JrQvtC90YLQtdC50L3QtdGAINC00LvRjyDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC5XG5cbiAgICAgICAgLy8gdGVsZXBob25lXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGhvbmVJbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcGhvbmVJbnB1dC52YWx1ZSA9ICcrMzgnOyAvLyDQkNCy0YLQvtC30LDQv9C+0LvQvdC10L3QuNC1INC/0YDQuCDRhNC+0LrRg9GB0LVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGhvbmVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG5cbiAgICAgICAgICAgIGlmIChlLmlucHV0VHlwZSA9PT0gXCJkZWxldGVDb250ZW50QmFja3dhcmRcIiAmJiB0aGlzLnZhbHVlLmVuZHNXaXRoKFwiIFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnKzM4ICcgKyB2YWx1ZS5zbGljZSgyLCA1KS50cmltKCkgKyAnICcgKyB2YWx1ZS5zbGljZSg1LCA4KS50cmltKCkgKyAnICcgKyB2YWx1ZS5zbGljZSg4LCAxMCkudHJpbSgpICsgJyAnICsgdmFsdWUuc2xpY2UoMTAsIDEyKS50cmltKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJyszOCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2NhbGVuZGFyXG4gICAgICAgIGRhdGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gdGhpcy52YWx1ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaWYgKHBhcnRzWzBdICYmIHBhcnRzWzBdLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnNsaWNlKDAsIDQpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBwYXJ0cy5qb2luKCctJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vaW5wdXRcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SW5wdXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ3dhcm5pbmcnKSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlU2luZ2xlSW5wdXQodGFyZ2V0SW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpc0FueUlucHV0RmlsbGVkID0gQXJyYXkuZnJvbShhbGxJbnB1dHMpLnNvbWUoaW5wdXQgPT4gaW5wdXQudmFsdWUudHJpbSgpICE9PSBcIlwiIHx8IGlucHV0LmNoZWNrZWQpO1xuICAgICAgICAgICAgaWYgKGlzQW55SW5wdXRGaWxsZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY2hlY2sgMSBpbnB1dFxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZVNpbmdsZUlucHV0KGlucHV0KSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJkYXRlXCIgJiYgaW5wdXQudmFsdWUgPT09IFwiMjAwMC0wMS0wMVwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC52YWx1ZS50cmltKCkgPT09IFwiXCIgfHwgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcGhvbmUnKSAmJiAhL15cXCszOFxccypcXGR7M31cXHMqXFxkezN9XFxzKlxcZHsyfVxccypcXGR7Mn0kLy50ZXN0KGlucHV0LnZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmVnaW9uJykgJiYgaW5wdXQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtY2hlY2tib3gnKSAmJiAhaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yYWRpbycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNSYWRpb0NoZWNrZWQgPSBBcnJheS5mcm9tKHJhZGlvSW5wdXRzKS5zb21lKHJhZGlvID0+IHJhZGlvLmNoZWNrZWQpO1xuICAgICAgICAgICAgICAgIGlmICghaXNSYWRpb0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkYXRpb25cbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVJbnB1dHMoZm9ybSkge1xuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IGhhc1dhcm5pbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgYWxsSW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gdGVsZWdyYW1JbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwiZGF0ZVwiICYmIGlucHV0LnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC52YWx1ZS50cmltKCkgPT09IFwiXCIgfHwgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcGhvbmUnKSAmJiAhL15cXCszOFxccypcXGR7M31cXHMqXFxkezN9XFxzKlxcZHsyfVxccypcXGR7Mn0kLy50ZXN0KGlucHV0LnZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yZWdpb24nKSAmJiBpbnB1dC52YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LWNoZWNrYm94JykgJiYgIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yYWRpbycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzUmFkaW9DaGVja2VkID0gQXJyYXkuZnJvbShyYWRpb0lucHV0cykuc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JhZGlvQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNXYXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkXG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uICBjaGVja1ZhbGlkKCl7XG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBjb25zdCB3YXJuaW5ncyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcIi53YXJuaW5nXCIpO1xuICAgICAgICAgICAgd2FybmluZ3MuZm9yRWFjaCh3YXJuaW5nID0+IHdhcm5pbmcuY2xhc3NMaXN0LnJlbW92ZShcIndhcm5pbmdcIikpOyAvLyDQntGH0LjRgdGC0LjRgtC4INC/0L7Qv9C10YDQtdC00L3RliDQv9C+0LzQuNC70LrQuFxuXG4gICAgICAgICAgICAvLyDQpNGD0L3QutGG0ZbRjyDQtNC70Y8g0LTQvtC00LDQstCw0L3QvdGPINC/0L7Qv9C10YDQtdC00LbQtdC90L3Rj1xuICAgICAgICAgICAgY29uc3QgYWRkV2FybmluZyA9IChpbnB1dCwgbWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlucHV0KVxuXG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJ3YXJuaW5nXCIpO1xuICAgICAgICAgICAgICAgIGxldCB3YXJuaW5nTWVzc2FnZSA9IGlucHV0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAoIXdhcm5pbmdNZXNzYWdlIHx8ICF3YXJuaW5nTWVzc2FnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJmb3JtX193YXJuaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdNZXNzYWdlLmNsYXNzTGlzdC5hZGQoXCJmb3JtX193YXJuaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nTWVzc2FnZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQod2FybmluZ01lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBzdXJuYW1lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGZpcnN0TmFtZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBzZWNvbmROYW1lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IHBob25lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGJpcnRoRGF0ZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBpc01pbGl0YXJ5VmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGNvbnNlbnRWYWxpZCA9IGZhbHNlXG5cblxuICAgICAgICAgICAgY29uc3Qgc3VybmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1zdXJuYW1lXCIpO1xuICAgICAgICAgICAgc3VybmFtZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT57XG4gICAgICAgICAgICAgICAgaWYgKCFzdXJuYW1lLnZhbHVlLnRyaW0oKSkgYWRkV2FybmluZyhzdXJuYW1lLCBcItCf0YDRltC30LLQuNGJ0LUg0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmICghc3VybmFtZS52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKHN1cm5hbWUsIFwi0J/RgNGW0LfQstC40YnQtSDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHN1cm5hbWVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlyc3ROYW1lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWZpcnN0LW5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIWZpcnN0TmFtZS52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGZpcnN0TmFtZSwgXCLQhtC8J9GPINC+0LHQvtCyJ9GP0LfQutC+0LLQtVwiKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY29uZE5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtbWlkZGxlLW5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXNlY29uZE5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhzZWNvbmROYW1lLCBcItCf0L4g0LHQsNGC0YzQutC+0LLRliDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2Vjb25kTmFtZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0YLQtdC70LXRhNC+0L3Rg1xuICAgICAgICAgICAgY29uc3QgcGhvbmUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtcGhvbmVcIik7XG4gICAgICAgICAgICBpZiAoIXBob25lLnZhbHVlLnRyaW0oKSB8fCAhL15cXCszOFxccz9cXGR7M31cXHM/XFxkezN9XFxzP1xcZHsyfVxccz9cXGR7Mn0kLy50ZXN0KHBob25lLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcocGhvbmUsIFwi0J3QvtC80LXRgCDRgtC10LvQtdGE0L7QvdGDINC+0LHQvtCyJ9GP0LfQutC+0LLQuNC5XCIpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBwaG9uZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0LTQsNGC0Lgg0L3QsNGA0L7QtNC20LXQvdC90Y9cbiAgICAgICAgICAgIGNvbnN0IGJpcnRoRGF0ZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1kYXRlXCIpO1xuICAgICAgICAgICAgaWYgKCFiaXJ0aERhdGUudmFsdWUgfHwgYmlydGhEYXRlLnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoYmlydGhEYXRlLCBcItCU0LDRgtCwINC90LDRgNC+0LTQttC10L3QvdGPINC+0LHQvtCyJ9GP0LfQutC+0LLQsFwiKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0LLRltC50YHRjNC60L7QstC+0YHQu9GD0LbQsdC+0LLRhtGPXG4gICAgICAgICAgICBjb25zdCBpc01pbGl0YXJ5ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXJhZGlvOmNoZWNrZWRcIik7XG4gICAgICAgICAgICBpZiAoIWlzTWlsaXRhcnkpe1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX3JhZGlvLWdyb3VwXCIpLCBcItCe0LHQtdGA0ZbRgtGMINCy0LDRgNGW0LDQvdGCXCIpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIGlzTWlsaXRhcnlWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINC30LPQvtC00Lgg0L3QsCDQvtCx0YDQvtCx0LrRgyDQtNCw0L3QuNGFXG4gICAgICAgICAgICBjb25zdCBjb25zZW50ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWNoZWNrYm94XCIpO1xuICAgICAgICAgICAgaWYgKCFjb25zZW50LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGNvbnNlbnQsIFwi0JLQuCDQv9C+0LLQuNC90L3RliDQv9C+0LPQvtC00LjRgtC40YHRjyDQtyDQvtCx0YDQvtCx0LrQvtGOINC00LDQvdC40YVcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zZW50VmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdXJuYW1lVmFsaWQgJiYgZmlyc3ROYW1lVmFsaWQgJiYgc2Vjb25kTmFtZVZhbGlkICYmIHBob25lVmFsaWQgJiYgYmlydGhEYXRlVmFsaWQgJiYgaXNNaWxpdGFyeVZhbGlkICYmIGNvbnNlbnRWYWxpZCl7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZFxuICAgICAgICB9XG5cblxuICAgICAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICAgICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vINCX0LDQsdC70L7QutGD0LLQsNGC0Lgg0YHRgtCw0L3QtNCw0YDRgtC90YMg0LLRltC00L/RgNCw0LLQutGDXG4gICAgICAgICAgICAgICAgLy8gdmFsaWRhdGVJbnB1dHMoZm9ybSlcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGNoZWNrVmFsaWQoKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlzVmFsaWQpXG5cblxuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZHNhZFwiKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTsgLy9cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmZXRjaChmb3JtLmFjdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTsgLy8g0JLQuNCy0LXRgdGC0Lgg0LLRltC00L/QvtCy0ZbQtNGMINCy0ZbQtCDRgdC10YDQstC10YDQsFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc01lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fd2FybmluZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaW5jbHVkZXMoXCLQlNGP0LrRg9GU0LzQviDQt9CwINCy0LDRiNGDINC30LDRj9Cy0LrRgyFcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INGD0YHQv9GW0YVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpOyAvLyDQntGH0LjRgdGC0LjRgtC4INGE0L7RgNC80YNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INC/0L7QvNC40LvQutGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwi0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0ZbQtNC/0YDQsNCy0YbRliDRhNC+0YDQvNC4LiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuDpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwi0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0ZbQtNC/0YDQsNCy0YbRliDRhNC+0YDQvNC4LiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG59KTtcblxuXG5cbiJdfQ==
