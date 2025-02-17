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

    // telephone
    phoneInput.addEventListener('focus', function () {
      if (phoneInput.value.trim() === '') {
        phoneInput.value = '+38'; // Автозаполнение при фокусе
        phoneInput.setSelectionRange(3, 3); // Ставим курсор после +38
      }
    });
    phoneInput.addEventListener('input', function (e) {
      var start = this.selectionStart;
      var rawValue = this.value.replace(/\D/g, ''); // Убираем все нецифровые символы

      if (e.inputType === "deleteContentBackward" && this.value.endsWith(" ")) {
        this.value = this.value.slice(0, -1);
        start--; // Корректируем позицию каретки при удалении пробела
      }
      var formattedValue = '+38';
      if (rawValue.length > 2) formattedValue += ' ' + rawValue.slice(2, 5);
      if (rawValue.length > 5) formattedValue += ' ' + rawValue.slice(5, 8);
      if (rawValue.length > 8) formattedValue += ' ' + rawValue.slice(8, 10);
      if (rawValue.length > 10) formattedValue += ' ' + rawValue.slice(10, 12);

      // Определяем разницу в длине
      var diff = formattedValue.length - this.value.length;
      this.value = formattedValue;

      // Корректируем позицию каретки
      this.setSelectionRange(start + diff, start + diff);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY2hlY2tWaXNpYmlsaXR5IiwiZm9yRWFjaCIsImVsIiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwiY2xhc3NMaXN0IiwiYWRkIiwiYnRuIiwicXVlcnlTZWxlY3RvciIsImZvcm0iLCJzdHlsZSIsImRpc3BsYXkiLCJ0ZXh0Q29udGVudCIsInNsaWRlcldyYXBwZXIiLCJzbGlkZXMiLCJwcmV2QnRuIiwibmV4dEJ0biIsImRvdHNDb250YWluZXIiLCJjdXJyZW50SW5kZXgiLCJpbnRlcnZhbCIsInRvdWNoU3RhcnRYIiwidG91Y2hFbmRYIiwidXBkYXRlU2xpZGVyIiwic2xpZGUiLCJpbmRleCIsInJlbW92ZSIsImNvbmNhdCIsImRvdCIsInRvZ2dsZSIsInN0b3BBdXRvU2xpZGUiLCJzdGFydEF1dG9TbGlkZSIsIm5leHRTbGlkZSIsImxlbmd0aCIsInByZXZTbGlkZSIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImhhbmRsZVRvdWNoU3RhcnQiLCJldmVudCIsInRvdWNoZXMiLCJjbGllbnRYIiwiaGFuZGxlVG91Y2hFbmQiLCJjaGFuZ2VkVG91Y2hlcyIsImhhbmRsZVN3aXBlIiwic3dpcGVUaHJlc2hvbGQiLCJfIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiZm9ybXMiLCJwaG9uZUlucHV0IiwiZGF0ZUlucHV0IiwicmVnaW9uSW5wdXQiLCJjaGVja2JveElucHV0IiwicmFkaW9JbnB1dHMiLCJzdWJtaXRCdXR0b24iLCJhbGxJbnB1dHMiLCJ0ZWxlZ3JhbUlucHV0IiwiZm9ybVdhcm5pbmciLCJ2YWx1ZSIsInRyaW0iLCJzZXRTZWxlY3Rpb25SYW5nZSIsImUiLCJzdGFydCIsInNlbGVjdGlvblN0YXJ0IiwicmF3VmFsdWUiLCJyZXBsYWNlIiwiaW5wdXRUeXBlIiwiZW5kc1dpdGgiLCJzbGljZSIsImZvcm1hdHRlZFZhbHVlIiwiZGlmZiIsInBhcnRzIiwic3BsaXQiLCJqb2luIiwidGFyZ2V0SW5wdXQiLCJ0YXJnZXQiLCJjb250YWlucyIsInZhbGlkYXRlU2luZ2xlSW5wdXQiLCJpc0FueUlucHV0RmlsbGVkIiwiQXJyYXkiLCJmcm9tIiwic29tZSIsImlucHV0IiwiY2hlY2tlZCIsInR5cGUiLCJ0ZXN0IiwiaXNSYWRpb0NoZWNrZWQiLCJyYWRpbyIsInZhbGlkYXRlSW5wdXRzIiwiaXNWYWxpZCIsImhhc1dhcm5pbmciLCJjaGVja1ZhbGlkIiwid2FybmluZ3MiLCJ3YXJuaW5nIiwiYWRkV2FybmluZyIsIm1lc3NhZ2UiLCJ3YXJuaW5nTWVzc2FnZSIsIm5leHRFbGVtZW50U2libGluZyIsInBhcmVudE5vZGUiLCJzdXJuYW1lVmFsaWQiLCJmaXJzdE5hbWVWYWxpZCIsInNlY29uZE5hbWVWYWxpZCIsInBob25lVmFsaWQiLCJiaXJ0aERhdGVWYWxpZCIsImlzTWlsaXRhcnlWYWxpZCIsImNvbnNlbnRWYWxpZCIsInN1cm5hbWUiLCJmaXJzdE5hbWUiLCJzZWNvbmROYW1lIiwicGhvbmUiLCJiaXJ0aERhdGUiLCJpc01pbGl0YXJ5IiwiY29uc2VudCIsInByZXZlbnREZWZhdWx0IiwiY29uc29sZSIsImxvZyIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJzdWNjZXNzTWVzc2FnZSIsInNldFRpbWVvdXQiLCJyZXNldCIsImZldGNoIiwiYWN0aW9uIiwibWV0aG9kIiwiYm9keSIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJkYXRhIiwiZXJyb3JNZXNzYWdlIiwiaW5jbHVkZXMiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxRQUFRLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVk7RUFDdEQsSUFBTUMsUUFBUSxHQUFHRixRQUFRLENBQUNHLGdCQUFnQixDQUFDLHVEQUF1RCxDQUFD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LFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFO2NBQzFDO2NBQ0EsSUFBSVosY0FBYyxFQUFFO2dCQUNoQkEsY0FBYyxDQUFDaEgsU0FBUyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUN2Q2dILFVBQVUsQ0FBQyxZQUFNO2tCQUNiRCxjQUFjLENBQUNoSCxTQUFTLENBQUNvQixNQUFNLENBQUMsU0FBUyxDQUFDO2tCQUMxQ2hCLElBQUksQ0FBQzhHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsQ0FBQyxFQUFFLElBQUksQ0FBQztjQUNaO1lBQ0osQ0FBQyxNQUFNO2NBQ0g7Y0FDQTtjQUNBO2NBQ0E7Y0FDQTtZQUFBO1VBRVIsQ0FBQyxDQUFDLFNBQ0ksQ0FBQyxVQUFBVyxLQUFLLEVBQUk7WUFDWmpCLE9BQU8sQ0FBQ2lCLEtBQUssQ0FBQyw4QkFBOEIsRUFBRUEsS0FBSyxDQUFDO1lBQ3BELElBQU1GLFlBQVksR0FBR3ZILElBQUksQ0FBQ0QsYUFBYSxDQUFDLGdCQUFnQixDQUFDO1lBQ3pELElBQUl3SCxZQUFZLEVBQUU7Y0FDZEEsWUFBWSxDQUFDcEgsV0FBVyxHQUFHLGdEQUFnRDtjQUMzRW9ILFlBQVksQ0FBQzNILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUN6QztVQUNKLENBQUMsQ0FBQztRQUNWO01BQ0osQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0VBRU4sQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2ZhZGUtaW4gd2hlbiB2aXNpYmxlXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZhZGUtaW4sIC5zbGlkZUluTGVmdCwgLnNsaWRlSW5SaWdodCwgLmZhZGVJbkZyb21Ub3BcIik7XG5cbiAgICBmdW5jdGlvbiBjaGVja1Zpc2liaWxpdHkoKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgaWYgKHJlY3QudG9wIDwgd2luZG93LmlubmVySGVpZ2h0ICogMC45KSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGNoZWNrVmlzaWJpbGl0eSk7XG4gICAgY2hlY2tWaXNpYmlsaXR5KCk7XG59KTtcblxuLy9vcGVuIGZvcm0gYmxvY2tcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhlYWRlcl9fY29udGVudC1idG5cIik7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlyc3RGb3JtXCIpO1xuXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmb3JtLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiIHx8IGZvcm0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIikge1xuICAgICAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gXCLQl9Cz0L7RgNC90YPRgtC4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IFwi0JTQvtGU0LTQvdCw0YLQuNGB0YxcIjtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbi8vc2xpZGVyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc2xpZGVyV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX193cmFwcGVyXCIpO1xuICAgIGNvbnN0IHNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2xpZGVyX19zbGlkZVwiKTtcbiAgICBjb25zdCBwcmV2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2J0bi1wcmV2XCIpO1xuICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fYnRuLW5leHRcIik7XG4gICAgY29uc3QgZG90c0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19kb3RzXCIpO1xuICAgIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICAgIGxldCBpbnRlcnZhbDtcbiAgICBsZXQgdG91Y2hTdGFydFggPSAwO1xuICAgIGxldCB0b3VjaEVuZFggPSAwO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlU2xpZGVyKCkge1xuICAgICAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIsIFwib3BhY2l0eVwiKVxuICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LmFkZChgJHtpbmRleCA9PT0gY3VycmVudEluZGV4ID8gXCJhY3RpdmVcIiA6IFwib3BhY2l0eVwifWApXG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNsaWRlcl9fZG90XCIpLmZvckVhY2goKGRvdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGRvdC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIGluZGV4ID09PSBjdXJyZW50SW5kZXgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdG9wQXV0b1NsaWRlKCk7XG4gICAgICAgIHN0YXJ0QXV0b1NsaWRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV4dFNsaWRlKCkge1xuICAgICAgICBjdXJyZW50SW5kZXggPSAoY3VycmVudEluZGV4ICsgMSkgJSBzbGlkZXMubGVuZ3RoO1xuICAgICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2U2xpZGUoKSB7XG4gICAgICAgIGN1cnJlbnRJbmRleCA9IChjdXJyZW50SW5kZXggLSAxICsgc2xpZGVzLmxlbmd0aCkgJSBzbGlkZXMubGVuZ3RoO1xuICAgICAgICB1cGRhdGVTbGlkZXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydEF1dG9TbGlkZSgpIHtcbiAgICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChuZXh0U2xpZGUsIDMwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3BBdXRvU2xpZGUoKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnQoZXZlbnQpIHtcbiAgICAgICAgdG91Y2hTdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlVG91Y2hFbmQoZXZlbnQpIHtcbiAgICAgICAgdG91Y2hFbmRYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgaGFuZGxlU3dpcGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVTd2lwZSgpIHtcbiAgICAgICAgY29uc3Qgc3dpcGVUaHJlc2hvbGQgPSA1MDtcbiAgICAgICAgaWYgKHRvdWNoU3RhcnRYIC0gdG91Y2hFbmRYID4gc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIG5leHRTbGlkZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRvdWNoRW5kWCAtIHRvdWNoU3RhcnRYID4gc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIHByZXZTbGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2xpZGVzLmZvckVhY2goKF8sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBkb3QuY2xhc3NMaXN0LmFkZChcInNsaWRlcl9fZG90XCIpO1xuICAgICAgICBkb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb3RzQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgfSk7XG5cbiAgICBwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2U2xpZGUpO1xuICAgIG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5leHRTbGlkZSk7XG5cbiAgICAvLyBtb2Igc3dpcGVcbiAgICBzbGlkZXJXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGhhbmRsZVRvdWNoU3RhcnQpO1xuICAgIHNsaWRlcldyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZVRvdWNoRW5kKTtcblxuICAgIHVwZGF0ZVNsaWRlcigpO1xufSk7XG5cblxuLy9mb3JtXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJyk7ICAvLyDQktGB0LUg0YTQvtGA0LzRiyDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblxuICAgIGZvcm1zLmZvckVhY2goZm9ybSA9PiB7XG4gICAgICAgIGNvbnN0IHBob25lSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1waG9uZScpO1xuICAgICAgICBjb25zdCBkYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1kYXRlJyk7XG4gICAgICAgIGNvbnN0IHJlZ2lvbklucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9faW5wdXQtcmVnaW9uJyk7XG4gICAgICAgIGNvbnN0IGNoZWNrYm94SW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1jaGVja2JveCcpO1xuICAgICAgICBjb25zdCByYWRpb0lucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1cInllcy1ub1wiXScpOyAvLyDQlNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQstC+0LXQvdC90L7RgdC70YPQttCw0YnQtdCz0L5cbiAgICAgICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fc3VibWl0Jyk7XG4gICAgICAgIGNvbnN0IGFsbElucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmZvcm1fX2lucHV0Jyk7XG4gICAgICAgIGNvbnN0IHRlbGVncmFtSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC10ZWxlZ3JhbScpOyAvLyDQndGW0Log0LIg0YLQtdC70LXQs9GA0LDQvNGWXG4gICAgICAgIGNvbnN0IGZvcm1XYXJuaW5nID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fd2FybmluZycpOyAgLy8g0JrQvtC90YLQtdC50L3QtdGAINC00LvRjyDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC5XG5cbiAgICAgICAgLy8gdGVsZXBob25lXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGhvbmVJbnB1dC52YWx1ZS50cmltKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcGhvbmVJbnB1dC52YWx1ZSA9ICcrMzgnOyAvLyDQkNCy0YLQvtC30LDQv9C+0LvQvdC10L3QuNC1INC/0YDQuCDRhNC+0LrRg9GB0LVcbiAgICAgICAgICAgICAgICBwaG9uZUlucHV0LnNldFNlbGVjdGlvblJhbmdlKDMsIDMpOyAvLyDQodGC0LDQstC40Lwg0LrRg9GA0YHQvtGAINC/0L7RgdC70LUgKzM4XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBob25lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgIGxldCByYXdWYWx1ZSA9IHRoaXMudmFsdWUucmVwbGFjZSgvXFxEL2csICcnKTsgLy8g0KPQsdC40YDQsNC10Lwg0LLRgdC1INC90LXRhtC40YTRgNC+0LLRi9C1INGB0LjQvNCy0L7Qu9GLXG5cbiAgICAgICAgICAgIGlmIChlLmlucHV0VHlwZSA9PT0gXCJkZWxldGVDb250ZW50QmFja3dhcmRcIiAmJiB0aGlzLnZhbHVlLmVuZHNXaXRoKFwiIFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICBzdGFydC0tOyAvLyDQmtC+0YDRgNC10LrRgtC40YDRg9C10Lwg0L/QvtC30LjRhtC40Y4g0LrQsNGA0LXRgtC60Lgg0L/RgNC4INGD0LTQsNC70LXQvdC40Lgg0L/RgNC+0LHQtdC70LBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGZvcm1hdHRlZFZhbHVlID0gJyszOCc7XG5cbiAgICAgICAgICAgIGlmIChyYXdWYWx1ZS5sZW5ndGggPiAyKSBmb3JtYXR0ZWRWYWx1ZSArPSAnICcgKyByYXdWYWx1ZS5zbGljZSgyLCA1KTtcbiAgICAgICAgICAgIGlmIChyYXdWYWx1ZS5sZW5ndGggPiA1KSBmb3JtYXR0ZWRWYWx1ZSArPSAnICcgKyByYXdWYWx1ZS5zbGljZSg1LCA4KTtcbiAgICAgICAgICAgIGlmIChyYXdWYWx1ZS5sZW5ndGggPiA4KSBmb3JtYXR0ZWRWYWx1ZSArPSAnICcgKyByYXdWYWx1ZS5zbGljZSg4LCAxMCk7XG4gICAgICAgICAgICBpZiAocmF3VmFsdWUubGVuZ3RoID4gMTApIGZvcm1hdHRlZFZhbHVlICs9ICcgJyArIHJhd1ZhbHVlLnNsaWNlKDEwLCAxMik7XG5cbiAgICAgICAgICAgIC8vINCe0L/RgNC10LTQtdC70Y/QtdC8INGA0LDQt9C90LjRhtGDINCyINC00LvQuNC90LVcbiAgICAgICAgICAgIGxldCBkaWZmID0gZm9ybWF0dGVkVmFsdWUubGVuZ3RoIC0gdGhpcy52YWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBmb3JtYXR0ZWRWYWx1ZTtcblxuICAgICAgICAgICAgLy8g0JrQvtGA0YDQtdC60YLQuNGA0YPQtdC8INC/0L7Qt9C40YbQuNGOINC60LDRgNC10YLQutC4XG4gICAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKHN0YXJ0ICsgZGlmZiwgc3RhcnQgKyBkaWZmKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvL2NhbGVuZGFyXG4gICAgICAgIGRhdGVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gdGhpcy52YWx1ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaWYgKHBhcnRzWzBdICYmIHBhcnRzWzBdLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnNsaWNlKDAsIDQpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBwYXJ0cy5qb2luKCctJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vaW5wdXRcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0SW5wdXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ3dhcm5pbmcnKSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlU2luZ2xlSW5wdXQodGFyZ2V0SW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpc0FueUlucHV0RmlsbGVkID0gQXJyYXkuZnJvbShhbGxJbnB1dHMpLnNvbWUoaW5wdXQgPT4gaW5wdXQudmFsdWUudHJpbSgpICE9PSBcIlwiIHx8IGlucHV0LmNoZWNrZWQpO1xuICAgICAgICAgICAgaWYgKGlzQW55SW5wdXRGaWxsZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY2hlY2sgMSBpbnB1dFxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZVNpbmdsZUlucHV0KGlucHV0KSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJkYXRlXCIgJiYgaW5wdXQudmFsdWUgPT09IFwiMjAwMC0wMS0wMVwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC52YWx1ZS50cmltKCkgPT09IFwiXCIgfHwgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcGhvbmUnKSAmJiAhL15cXCszOFxccypcXGR7M31cXHMqXFxkezN9XFxzKlxcZHsyfVxccypcXGR7Mn0kLy50ZXN0KGlucHV0LnZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcmVnaW9uJykgJiYgaW5wdXQudmFsdWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtY2hlY2tib3gnKSAmJiAhaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yYWRpbycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNSYWRpb0NoZWNrZWQgPSBBcnJheS5mcm9tKHJhZGlvSW5wdXRzKS5zb21lKHJhZGlvID0+IHJhZGlvLmNoZWNrZWQpO1xuICAgICAgICAgICAgICAgIGlmICghaXNSYWRpb0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkYXRpb25cbiAgICAgICAgZnVuY3Rpb24gdmFsaWRhdGVJbnB1dHMoZm9ybSkge1xuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IGhhc1dhcm5pbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgYWxsSW5wdXRzLmZvckVhY2goaW5wdXQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gdGVsZWdyYW1JbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LnR5cGUgPT09IFwiZGF0ZVwiICYmIGlucHV0LnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC52YWx1ZS50cmltKCkgPT09IFwiXCIgfHwgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtcGhvbmUnKSAmJiAhL15cXCszOFxccypcXGR7M31cXHMqXFxkezN9XFxzKlxcZHsyfVxccypcXGR7Mn0kLy50ZXN0KGlucHV0LnZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yZWdpb24nKSAmJiBpbnB1dC52YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LWNoZWNrYm94JykgJiYgIWlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yYWRpbycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzUmFkaW9DaGVja2VkID0gQXJyYXkuZnJvbShyYWRpb0lucHV0cykuc29tZShyYWRpbyA9PiByYWRpby5jaGVja2VkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JhZGlvQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChoYXNXYXJuaW5nKSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkXG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uICBjaGVja1ZhbGlkKCl7XG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBjb25zdCB3YXJuaW5ncyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcIi53YXJuaW5nXCIpO1xuICAgICAgICAgICAgd2FybmluZ3MuZm9yRWFjaCh3YXJuaW5nID0+IHdhcm5pbmcuY2xhc3NMaXN0LnJlbW92ZShcIndhcm5pbmdcIikpOyAvLyDQntGH0LjRgdGC0LjRgtC4INC/0L7Qv9C10YDQtdC00L3RliDQv9C+0LzQuNC70LrQuFxuXG4gICAgICAgICAgICAvLyDQpNGD0L3QutGG0ZbRjyDQtNC70Y8g0LTQvtC00LDQstCw0L3QvdGPINC/0L7Qv9C10YDQtdC00LbQtdC90L3Rj1xuICAgICAgICAgICAgY29uc3QgYWRkV2FybmluZyA9IChpbnB1dCwgbWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlucHV0KVxuXG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoXCJ3YXJuaW5nXCIpO1xuICAgICAgICAgICAgICAgIGxldCB3YXJuaW5nTWVzc2FnZSA9IGlucHV0Lm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgICAgICAgICBpZiAoIXdhcm5pbmdNZXNzYWdlIHx8ICF3YXJuaW5nTWVzc2FnZS5jbGFzc0xpc3QuY29udGFpbnMoXCJmb3JtX193YXJuaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdNZXNzYWdlLmNsYXNzTGlzdC5hZGQoXCJmb3JtX193YXJuaW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5nTWVzc2FnZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQod2FybmluZ01lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxldCBzdXJuYW1lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGZpcnN0TmFtZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBzZWNvbmROYW1lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IHBob25lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGJpcnRoRGF0ZVZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGxldCBpc01pbGl0YXJ5VmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGNvbnNlbnRWYWxpZCA9IGZhbHNlXG5cblxuICAgICAgICAgICAgY29uc3Qgc3VybmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1zdXJuYW1lXCIpO1xuICAgICAgICAgICAgc3VybmFtZS5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT57XG4gICAgICAgICAgICAgICAgaWYgKCFzdXJuYW1lLnZhbHVlLnRyaW0oKSkgYWRkV2FybmluZyhzdXJuYW1lLCBcItCf0YDRltC30LLQuNGJ0LUg0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGlmICghc3VybmFtZS52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKHN1cm5hbWUsIFwi0J/RgNGW0LfQstC40YnQtSDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHN1cm5hbWVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZmlyc3ROYW1lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWZpcnN0LW5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIWZpcnN0TmFtZS52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGZpcnN0TmFtZSwgXCLQhtC8J9GPINC+0LHQvtCyJ9GP0LfQutC+0LLQtVwiKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY29uZE5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtbWlkZGxlLW5hbWVcIik7XG4gICAgICAgICAgICBpZiAoIXNlY29uZE5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhzZWNvbmROYW1lLCBcItCf0L4g0LHQsNGC0YzQutC+0LLRliDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgc2Vjb25kTmFtZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0YLQtdC70LXRhNC+0L3Rg1xuICAgICAgICAgICAgY29uc3QgcGhvbmUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtcGhvbmVcIik7XG4gICAgICAgICAgICBpZiAoIXBob25lLnZhbHVlLnRyaW0oKSB8fCAhL15cXCszOFxccz9cXGR7M31cXHM/XFxkezN9XFxzP1xcZHsyfVxccz9cXGR7Mn0kLy50ZXN0KHBob25lLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcocGhvbmUsIFwi0J3QvtC80LXRgCDRgtC10LvQtdGE0L7QvdGDINC+0LHQvtCyJ9GP0LfQutC+0LLQuNC5XCIpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBwaG9uZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0LTQsNGC0Lgg0L3QsNGA0L7QtNC20LXQvdC90Y9cbiAgICAgICAgICAgIGNvbnN0IGJpcnRoRGF0ZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1kYXRlXCIpO1xuICAgICAgICAgICAgaWYgKCFiaXJ0aERhdGUudmFsdWUgfHwgYmlydGhEYXRlLnZhbHVlID09PSBcIjIwMDAtMDEtMDFcIikge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoYmlydGhEYXRlLCBcItCU0LDRgtCwINC90LDRgNC+0LTQttC10L3QvdGPINC+0LHQvtCyJ9GP0LfQutC+0LLQsFwiKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGJpcnRoRGF0ZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0LLRltC50YHRjNC60L7QstC+0YHQu9GD0LbQsdC+0LLRhtGPXG4gICAgICAgICAgICBjb25zdCBpc01pbGl0YXJ5ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXJhZGlvOmNoZWNrZWRcIik7XG4gICAgICAgICAgICBpZiAoIWlzTWlsaXRhcnkpe1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX3JhZGlvLWdyb3VwXCIpLCBcItCe0LHQtdGA0ZbRgtGMINCy0LDRgNGW0LDQvdGCXCIpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIGlzTWlsaXRhcnlWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINC30LPQvtC00Lgg0L3QsCDQvtCx0YDQvtCx0LrRgyDQtNCw0L3QuNGFXG4gICAgICAgICAgICBjb25zdCBjb25zZW50ID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LWNoZWNrYm94XCIpO1xuICAgICAgICAgICAgaWYgKCFjb25zZW50LmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGNvbnNlbnQsIFwi0JLQuCDQv9C+0LLQuNC90L3RliDQv9C+0LPQvtC00LjRgtC40YHRjyDQtyDQvtCx0YDQvtCx0LrQvtGOINC00LDQvdC40YVcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zZW50VmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdXJuYW1lVmFsaWQgJiYgZmlyc3ROYW1lVmFsaWQgJiYgc2Vjb25kTmFtZVZhbGlkICYmIHBob25lVmFsaWQgJiYgYmlydGhEYXRlVmFsaWQgJiYgaXNNaWxpdGFyeVZhbGlkICYmIGNvbnNlbnRWYWxpZCl7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZFxuICAgICAgICB9XG5cblxuICAgICAgICBmb3Jtcy5mb3JFYWNoKGZvcm0gPT4ge1xuICAgICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vINCX0LDQsdC70L7QutGD0LLQsNGC0Lgg0YHRgtCw0L3QtNCw0YDRgtC90YMg0LLRltC00L/RgNCw0LLQutGDXG4gICAgICAgICAgICAgICAgLy8gdmFsaWRhdGVJbnB1dHMoZm9ybSlcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9IGNoZWNrVmFsaWQoKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlzVmFsaWQpXG5cblxuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZHNhZFwiKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTsgLy9cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTAwMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmZXRjaChmb3JtLmFjdGlvbiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTsgLy8g0JLQuNCy0LXRgdGC0Lgg0LLRltC00L/QvtCy0ZbQtNGMINCy0ZbQtCDRgdC10YDQstC10YDQsFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc01lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fd2FybmluZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaW5jbHVkZXMoXCLQlNGP0LrRg9GU0LzQviDQt9CwINCy0LDRiNGDINC30LDRj9Cy0LrRgyFcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INGD0YHQv9GW0YVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpOyAvLyDQntGH0LjRgdGC0LjRgtC4INGE0L7RgNC80YNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9Cw0YLQuCDQv9C+0LLRltC00L7QvNC70LXQvdC90Y8g0L/RgNC+INC/0L7QvNC40LvQutGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwi0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0ZbQtNC/0YDQsNCy0YbRliDRhNC+0YDQvNC4LiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuDpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS50ZXh0Q29udGVudCA9IFwi0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0ZbQtNC/0YDQsNCy0YbRliDRhNC+0YDQvNC4LiDQodC/0YDQvtCx0YPQudGC0LUg0YnQtSDRgNCw0LcuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG59KTtcblxuXG5cbiJdfQ==
