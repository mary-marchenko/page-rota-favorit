"use strict";

//button for TEST
document.addEventListener('DOMContentLoaded', function () {
  var modalOverlay = document.querySelector('.form__success');
  var openModalBtn = document.querySelector('.dark-btn');
  if (!modalOverlay || !openModalBtn) {
    console.error("Елемент не знайдено!");
    return;
  }
  openModalBtn.addEventListener('click', function () {
    modalOverlay.style.display = 'flex';
  });
  modalOverlay.addEventListener('click', function () {
    modalOverlay.style.display = 'none';
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
    stopAutoSlide(); // Очищаємо поточний інтервал
    startAutoSlide(); // Запускаємо знову
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
    var swipeThreshold = 50; // Мінімальна дистанція для свайпу
    if (touchStartX - touchEndX > swipeThreshold) {
      nextSlide(); // Свайп вліво – наступний слайд
    } else if (touchEndX - touchStartX > swipeThreshold) {
      prevSlide(); // Свайп вправо – попередній слайд
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

  // Додаємо обробку свайпів на мобільних пристроях
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwibW9kYWxPdmVybGF5IiwicXVlcnlTZWxlY3RvciIsIm9wZW5Nb2RhbEJ0biIsImNvbnNvbGUiLCJlcnJvciIsInN0eWxlIiwiZGlzcGxheSIsImVsZW1lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImNoZWNrVmlzaWJpbGl0eSIsImZvckVhY2giLCJlbCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImNsYXNzTGlzdCIsImFkZCIsImJ0biIsImZvcm0iLCJ0ZXh0Q29udGVudCIsInNsaWRlcldyYXBwZXIiLCJzbGlkZXMiLCJwcmV2QnRuIiwibmV4dEJ0biIsImRvdHNDb250YWluZXIiLCJjdXJyZW50SW5kZXgiLCJpbnRlcnZhbCIsInRvdWNoU3RhcnRYIiwidG91Y2hFbmRYIiwidXBkYXRlU2xpZGVyIiwic2xpZGUiLCJpbmRleCIsImRvdCIsInRvZ2dsZSIsInN0b3BBdXRvU2xpZGUiLCJzdGFydEF1dG9TbGlkZSIsIm5leHRTbGlkZSIsImxlbmd0aCIsInByZXZTbGlkZSIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImhhbmRsZVRvdWNoU3RhcnQiLCJldmVudCIsInRvdWNoZXMiLCJjbGllbnRYIiwiaGFuZGxlVG91Y2hFbmQiLCJjaGFuZ2VkVG91Y2hlcyIsImhhbmRsZVN3aXBlIiwic3dpcGVUaHJlc2hvbGQiLCJfIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiZm9ybXMiLCJwaG9uZUlucHV0IiwiZGF0ZUlucHV0IiwicmVnaW9uSW5wdXQiLCJjaGVja2JveElucHV0IiwicmFkaW9JbnB1dHMiLCJzdWJtaXRCdXR0b24iLCJhbGxJbnB1dHMiLCJ0ZWxlZ3JhbUlucHV0IiwiZm9ybVdhcm5pbmciLCJ2YWx1ZSIsInRyaW0iLCJyZXBsYWNlIiwic2xpY2UiLCJ0YXJnZXRJbnB1dCIsInRhcmdldCIsImNvbnRhaW5zIiwidmFsaWRhdGVTaW5nbGVJbnB1dCIsImlzQW55SW5wdXRGaWxsZWQiLCJBcnJheSIsImZyb20iLCJzb21lIiwiaW5wdXQiLCJjaGVja2VkIiwicmVtb3ZlIiwidHlwZSIsInRlc3QiLCJpc1JhZGlvQ2hlY2tlZCIsInJhZGlvIiwidmFsaWRhdGVJbnB1dHMiLCJpc1ZhbGlkIiwiaGFzV2FybmluZyIsImNoZWNrVmFsaWQiLCJ3YXJuaW5ncyIsIndhcm5pbmciLCJhZGRXYXJuaW5nIiwibWVzc2FnZSIsIndhcm5pbmdNZXNzYWdlIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwicGFyZW50Tm9kZSIsInN1cm5hbWVWYWxpZCIsImZpcnN0TmFtZVZhbGlkIiwic2Vjb25kTmFtZVZhbGlkIiwicGhvbmVWYWxpZCIsImJpcnRoRGF0ZVZhbGlkIiwiaXNNaWxpdGFyeVZhbGlkIiwiY29uc2VudFZhbGlkIiwic3VybmFtZSIsImZpcnN0TmFtZSIsInNlY29uZE5hbWUiLCJwaG9uZSIsImJpcnRoRGF0ZSIsImlzTWlsaXRhcnkiLCJjb25zZW50IiwicHJldmVudERlZmF1bHQiLCJsb2ciLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwic3VjY2Vzc01lc3NhZ2UiLCJzZXRUaW1lb3V0IiwicmVzZXQiLCJmZXRjaCIsImFjdGlvbiIsIm1ldGhvZCIsImJvZHkiLCJ0aGVuIiwicmVzcG9uc2UiLCJ0ZXh0IiwiZGF0YSIsImVycm9yTWVzc2FnZSIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0FBLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsWUFBVztFQUNyRCxJQUFNQyxZQUFZLEdBQUdGLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLGdCQUFnQixDQUFDO0VBQzdELElBQU1DLFlBQVksR0FBR0osUUFBUSxDQUFDRyxhQUFhLENBQUMsV0FBVyxDQUFDO0VBRXhELElBQUksQ0FBQ0QsWUFBWSxJQUFJLENBQUNFLFlBQVksRUFBRTtJQUNoQ0MsT0FBTyxD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O0lBQ04sQ0FBQyxDQUFDO0VBRU4sQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2J1dHRvbiBmb3IgVEVTVFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGFsT3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgY29uc3Qgb3Blbk1vZGFsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhcmstYnRuJyk7XG5cbiAgICBpZiAoIW1vZGFsT3ZlcmxheSB8fCAhb3Blbk1vZGFsQnRuKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLQldC70LXQvNC10L3RgiDQvdC1INC30L3QsNC50LTQtdC90L4hXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3Blbk1vZGFsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIG1vZGFsT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIH0pO1xuXG4gICAgbW9kYWxPdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIG1vZGFsT3ZlcmxheS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0pO1xufSk7XG4vL2ZhZGUtaW4gd2hlbiB2aXNpYmxlXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZhZGUtaW4sIC5zbGlkZUluTGVmdCwgLnNsaWRlSW5SaWdodCwgLmZhZGVJbkZyb21Ub3BcIik7XG5cbiAgICBmdW5jdGlvbiBjaGVja1Zpc2liaWxpdHkoKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgaWYgKHJlY3QudG9wIDwgd2luZG93LmlubmVySGVpZ2h0ICogMC45KSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChcInZpc2libGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGNoZWNrVmlzaWJpbGl0eSk7XG4gICAgY2hlY2tWaXNpYmlsaXR5KCk7XG59KTtcblxuLy9vcGVuIGZvcm0gYmxvY2tcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhlYWRlcl9fY29udGVudC1idG5cIik7XG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmlyc3RGb3JtXCIpO1xuXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmb3JtLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiIHx8IGZvcm0uc3R5bGUuZGlzcGxheSA9PT0gXCJcIikge1xuICAgICAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgYnRuLnRleHRDb250ZW50ID0gXCLQl9Cz0L7RgNC90YPRgtC4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGJ0bi50ZXh0Q29udGVudCA9IFwi0JTQvtGU0LTQvdCw0YLQuNGB0YxcIjtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbi8vc2xpZGVyXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzbGlkZXJXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX3dyYXBwZXJcIik7XG4gICAgY29uc3Qgc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zbGlkZXJfX3NsaWRlXCIpO1xuICAgIGNvbnN0IHByZXZCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNsaWRlcl9fYnRuLXByZXZcIik7XG4gICAgY29uc3QgbmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2xpZGVyX19idG4tbmV4dFwiKTtcbiAgICBjb25zdCBkb3RzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zbGlkZXJfX2RvdHNcIik7XG4gICAgbGV0IGN1cnJlbnRJbmRleCA9IDA7XG4gICAgbGV0IGludGVydmFsO1xuICAgIGxldCB0b3VjaFN0YXJ0WCA9IDA7XG4gICAgbGV0IHRvdWNoRW5kWCA9IDA7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVTbGlkZXIoKSB7XG4gICAgICAgIHNsaWRlcy5mb3JFYWNoKChzbGlkZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHNsaWRlLnN0eWxlLmRpc3BsYXkgPSBpbmRleCA9PT0gY3VycmVudEluZGV4ID8gXCJmbGV4XCIgOiBcIm5vbmVcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2xpZGVyX19kb3RcIikuZm9yRWFjaCgoZG90LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgZG90LmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIiwgaW5kZXggPT09IGN1cnJlbnRJbmRleCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN0b3BBdXRvU2xpZGUoKTsgLy8g0J7Rh9C40YnQsNGU0LzQviDQv9C+0YLQvtGH0L3QuNC5INGW0L3RgtC10YDQstCw0LtcbiAgICAgICAgc3RhcnRBdXRvU2xpZGUoKTsgLy8g0JfQsNC/0YPRgdC60LDRlNC80L4g0LfQvdC+0LLRg1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5leHRTbGlkZSgpIHtcbiAgICAgICAgY3VycmVudEluZGV4ID0gKGN1cnJlbnRJbmRleCArIDEpICUgc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldlNsaWRlKCkge1xuICAgICAgICBjdXJyZW50SW5kZXggPSAoY3VycmVudEluZGV4IC0gMSArIHNsaWRlcy5sZW5ndGgpICUgc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRBdXRvU2xpZGUoKSB7XG4gICAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwobmV4dFNsaWRlLCAzMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdG9wQXV0b1NsaWRlKCkge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVUb3VjaFN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRvdWNoU3RhcnRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRvdWNoRW5kKGV2ZW50KSB7XG4gICAgICAgIHRvdWNoRW5kWCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIGhhbmRsZVN3aXBlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlU3dpcGUoKSB7XG4gICAgICAgIGNvbnN0IHN3aXBlVGhyZXNob2xkID0gNTA7IC8vINCc0ZbQvdGW0LzQsNC70YzQvdCwINC00LjRgdGC0LDQvdGG0ZbRjyDQtNC70Y8g0YHQstCw0LnQv9GDXG4gICAgICAgIGlmICh0b3VjaFN0YXJ0WCAtIHRvdWNoRW5kWCA+IHN3aXBlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBuZXh0U2xpZGUoKTsgLy8g0KHQstCw0LnQvyDQstC70ZbQstC+IOKAkyDQvdCw0YHRgtGD0L/QvdC40Lkg0YHQu9Cw0LnQtFxuICAgICAgICB9IGVsc2UgaWYgKHRvdWNoRW5kWCAtIHRvdWNoU3RhcnRYID4gc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgICAgICAgIHByZXZTbGlkZSgpOyAvLyDQodCy0LDQudC/INCy0L/RgNCw0LLQviDigJMg0L/QvtC/0LXRgNC10LTQvdGW0Lkg0YHQu9Cw0LnQtFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2xpZGVzLmZvckVhY2goKF8sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBkb3QuY2xhc3NMaXN0LmFkZChcInNsaWRlcl9fZG90XCIpO1xuICAgICAgICBkb3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdXBkYXRlU2xpZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkb3RzQ29udGFpbmVyLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgfSk7XG5cbiAgICBwcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwcmV2U2xpZGUpO1xuICAgIG5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG5leHRTbGlkZSk7XG5cbiAgICAvLyDQlNC+0LTQsNGU0LzQviDQvtCx0YDQvtCx0LrRgyDRgdCy0LDQudC/0ZbQsiDQvdCwINC80L7QsdGW0LvRjNC90LjRhSDQv9GA0LjRgdGC0YDQvtGP0YVcbiAgICBzbGlkZXJXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGhhbmRsZVRvdWNoU3RhcnQpO1xuICAgIHNsaWRlcldyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZVRvdWNoRW5kKTtcblxuICAgIHVwZGF0ZVNsaWRlcigpO1xufSk7XG5cblxuLy9mb3JtXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBmb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKTsgIC8vINCS0YHQtSDRhNC+0YDQvNGLINC90LAg0YHRgtGA0LDQvdC40YbQtVxuXG4gICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IHtcbiAgICAgICAgY29uc3QgcGhvbmVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX2lucHV0LXBob25lJyk7XG4gICAgICAgIGNvbnN0IGRhdGVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX2lucHV0LWRhdGUnKTtcbiAgICAgICAgY29uc3QgcmVnaW9uSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19pbnB1dC1yZWdpb24nKTtcbiAgICAgICAgY29uc3QgY2hlY2tib3hJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX2lucHV0LWNoZWNrYm94Jyk7XG4gICAgICAgIGNvbnN0IHJhZGlvSW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPVwieWVzLW5vXCJdJyk7IC8vINCU0LvRjyDQv9GA0L7QstC10YDQutC4INCy0L7QtdC90L3QvtGB0LvRg9C20LDRidC10LPQvlxuICAgICAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWJtaXQnKTtcbiAgICAgICAgY29uc3QgYWxsSW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybV9faW5wdXQnKTtcbiAgICAgICAgY29uc3QgdGVsZWdyYW1JbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX2lucHV0LXRlbGVncmFtJyk7IC8vINCd0ZbQuiDQsiDRgtC10LvQtdCz0YDQsNC80ZZcbiAgICAgICAgY29uc3QgZm9ybVdhcm5pbmcgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX193YXJuaW5nJyk7ICAvLyDQmtC+0L3RgtC10LnQvdC10YAg0LTQu9GPINC/0YDQtdC00YPQv9GA0LXQttC00LXQvdC40LlcblxuICAgICAgICAvLyB0ZWxlcGhvbmVcbiAgICAgICAgcGhvbmVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChwaG9uZUlucHV0LnZhbHVlLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBwaG9uZUlucHV0LnZhbHVlID0gJyszOCc7IC8vINCQ0LLRgtC+0LfQsNC/0L7Qu9C90LXQvdC40LUg0L/RgNC4INGE0L7QutGD0YHQtVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBwaG9uZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJyszOCAnICsgdmFsdWUuc2xpY2UoMiwgNSkgKyAnICcgKyB2YWx1ZS5zbGljZSg1LCA4KSArICcgJyArIHZhbHVlLnNsaWNlKDgsIDEwKSArICcgJyArIHZhbHVlLnNsaWNlKDEwLCAxMik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJyszOCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9pbnB1dFxuICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRJbnB1dCA9IGV2ZW50LnRhcmdldDtcblxuICAgICAgICAgICAgaWYgKHRhcmdldElucHV0LmNsYXNzTGlzdC5jb250YWlucygnd2FybmluZycpKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVTaW5nbGVJbnB1dCh0YXJnZXRJbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlzQW55SW5wdXRGaWxsZWQgPSBBcnJheS5mcm9tKGFsbElucHV0cykuc29tZShpbnB1dCA9PiBpbnB1dC52YWx1ZS50cmltKCkgIT09IFwiXCIgfHwgaW5wdXQuY2hlY2tlZCk7XG4gICAgICAgICAgICBpZiAoaXNBbnlJbnB1dEZpbGxlZCkge1xuICAgICAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBjaGVjayAxIGlucHV0XG4gICAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlU2luZ2xlSW5wdXQoaW5wdXQpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC50eXBlID09PSBcImRhdGVcIiAmJiBpbnB1dC52YWx1ZSA9PT0gXCIyMDAwLTAxLTAxXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnZhbHVlLnRyaW0oKSA9PT0gXCJcIiB8fCAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1waG9uZScpICYmICEvXlxcKzM4XFxzKlxcZHszfVxccypcXGR7M31cXHMqXFxkezJ9XFxzKlxcZHsyfSQvLnRlc3QoaW5wdXQudmFsdWUpKSkge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1yZWdpb24nKSAmJiBpbnB1dC52YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1jaGVja2JveCcpICYmICFpbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXJhZGlvJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JhZGlvQ2hlY2tlZCA9IEFycmF5LmZyb20ocmFkaW9JbnB1dHMpLnNvbWUocmFkaW8gPT4gcmFkaW8uY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1JhZGlvQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmFkaW9JbnB1dHMuZm9yRWFjaChyYWRpbyA9PiByYWRpby5jbGFzc0xpc3QucmVtb3ZlKCd3YXJuaW5nJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWRhdGlvblxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZUlucHV0cyhmb3JtKSB7XG4gICAgICAgICAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICBsZXQgaGFzV2FybmluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBhbGxJbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0ID09PSB0ZWxlZ3JhbUlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQudHlwZSA9PT0gXCJkYXRlXCIgJiYgaW5wdXQudmFsdWUgPT09IFwiMjAwMC0wMS0wMVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LnZhbHVlLnRyaW0oKSA9PT0gXCJcIiB8fCAoaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtX19pbnB1dC1waG9uZScpICYmICEvXlxcKzM4XFxzKlxcZHszfVxccypcXGR7M31cXHMqXFxkezJ9XFxzKlxcZHsyfSQvLnRlc3QoaW5wdXQudmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXJlZ2lvbicpICYmIGlucHV0LnZhbHVlID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzV2FybmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybV9faW5wdXQtY2hlY2tib3gnKSAmJiAhaW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc1dhcm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm1fX2lucHV0LXJhZGlvJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNSYWRpb0NoZWNrZWQgPSBBcnJheS5mcm9tKHJhZGlvSW5wdXRzKS5zb21lKHJhZGlvID0+IHJhZGlvLmNoZWNrZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUmFkaW9DaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpb0lucHV0cy5mb3JFYWNoKHJhZGlvID0+IHJhZGlvLmNsYXNzTGlzdC5hZGQoJ3dhcm5pbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNXYXJuaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhZGlvSW5wdXRzLmZvckVhY2gocmFkaW8gPT4gcmFkaW8uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGhhc1dhcm5pbmcpIHtcbiAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWRcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZnVuY3Rpb24gIGNoZWNrVmFsaWQoKXtcbiAgICAgICAgICAgIGxldCBpc1ZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIGNvbnN0IHdhcm5pbmdzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiLndhcm5pbmdcIik7XG4gICAgICAgICAgICB3YXJuaW5ncy5mb3JFYWNoKHdhcm5pbmcgPT4gd2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKFwid2FybmluZ1wiKSk7IC8vINCe0YfQuNGB0YLQuNGC0Lgg0L/QvtC/0LXRgNC10LTQvdGWINC/0L7QvNC40LvQutC4XG5cbiAgICAgICAgICAgIC8vINCk0YPQvdC60YbRltGPINC00LvRjyDQtNC+0LTQsNCy0LDQvdC90Y8g0L/QvtC/0LXRgNC10LTQttC10L3QvdGPXG4gICAgICAgICAgICBjb25zdCBhZGRXYXJuaW5nID0gKGlucHV0LCBtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW5wdXQpXG5cbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZChcIndhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgbGV0IHdhcm5pbmdNZXNzYWdlID0gaW5wdXQubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmICghd2FybmluZ01lc3NhZ2UgfHwgIXdhcm5pbmdNZXNzYWdlLmNsYXNzTGlzdC5jb250YWlucyhcImZvcm1fX3dhcm5pbmdcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZ01lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZ01lc3NhZ2UuY2xhc3NMaXN0LmFkZChcImZvcm1fX3dhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdNZXNzYWdlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh3YXJuaW5nTWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHN1cm5hbWVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgZmlyc3ROYW1lVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IHNlY29uZE5hbWVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgcGhvbmVWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgYmlydGhEYXRlVmFsaWQgPSBmYWxzZVxuICAgICAgICAgICAgbGV0IGlzTWlsaXRhcnlWYWxpZCA9IGZhbHNlXG4gICAgICAgICAgICBsZXQgY29uc2VudFZhbGlkID0gZmFsc2VcblxuXG4gICAgICAgICAgICAvLyDQktCw0LvRltC00LDRhtGW0Y8g0YLQtdC60YHRgtC+0LLQuNGFINC/0L7Qu9GW0LJcbiAgICAgICAgICAgIGNvbnN0IHN1cm5hbWUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtc3VybmFtZVwiKTtcbiAgICAgICAgICAgIHN1cm5hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsICgpID0+e1xuICAgICAgICAgICAgICAgIGlmICghc3VybmFtZS52YWx1ZS50cmltKCkpIGFkZFdhcm5pbmcoc3VybmFtZSwgXCLQn9GA0ZbQt9Cy0LjRidC1INC+0LHQvtCyJ9GP0LfQutC+0LLQtVwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZiAoIXN1cm5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhzdXJuYW1lLCBcItCf0YDRltC30LLQuNGJ0LUg0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzdXJuYW1lVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGZpcnN0TmFtZSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1maXJzdC1uYW1lXCIpO1xuICAgICAgICAgICAgaWYgKCFmaXJzdE5hbWUudmFsdWUudHJpbSgpKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhmaXJzdE5hbWUsIFwi0IbQvCfRjyDQvtCx0L7QsifRj9C30LrQvtCy0LVcIik7XG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGZpcnN0TmFtZVZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzZWNvbmROYW1lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LW1pZGRsZS1uYW1lXCIpO1xuICAgICAgICAgICAgaWYgKCFzZWNvbmROYW1lLnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIGFkZFdhcm5pbmcoc2Vjb25kTmFtZSwgXCLQn9C+INCx0LDRgtGM0LrQvtCy0ZYg0L7QsdC+0LIn0Y/Qt9C60L7QstC1XCIpO1xuXG5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHNlY29uZE5hbWVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINGC0LXQu9C10YTQvtC90YNcbiAgICAgICAgICAgIGNvbnN0IHBob25lID0gZm9ybS5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX2lucHV0LXBob25lXCIpO1xuICAgICAgICAgICAgaWYgKCFwaG9uZS52YWx1ZS50cmltKCkgfHwgIS9eXFwrMzhcXHM/XFxkezN9XFxzP1xcZHszfVxccz9cXGR7Mn1cXHM/XFxkezJ9JC8udGVzdChwaG9uZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKHBob25lLCBcItCd0L7QvNC10YAg0YLQtdC70LXRhNC+0L3RgyDQvtCx0L7QsifRj9C30LrQvtCy0LjQuVwiKTtcblxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgcGhvbmVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINC00LDRgtC4INC90LDRgNC+0LTQttC10L3QvdGPXG4gICAgICAgICAgICBjb25zdCBiaXJ0aERhdGUgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoXCIuZm9ybV9faW5wdXQtZGF0ZVwiKTtcbiAgICAgICAgICAgIGlmICghYmlydGhEYXRlLnZhbHVlIHx8IGJpcnRoRGF0ZS52YWx1ZSA9PT0gXCIyMDAwLTAxLTAxXCIpIHtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGJpcnRoRGF0ZSwgXCLQlNCw0YLQsCDQvdCw0YDQvtC00LbQtdC90L3RjyDQvtCx0L7QsifRj9C30LrQvtCy0LBcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBiaXJ0aERhdGVWYWxpZCA9IHRydWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g0JLQsNC70ZbQtNCw0YbRltGPINCy0ZbQudGB0YzQutC+0LLQvtGB0LvRg9C20LHQvtCy0YbRj1xuICAgICAgICAgICAgY29uc3QgaXNNaWxpdGFyeSA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1yYWRpbzpjaGVja2VkXCIpO1xuICAgICAgICAgICAgaWYgKCFpc01pbGl0YXJ5KXtcbiAgICAgICAgICAgICAgICBhZGRXYXJuaW5nKGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19yYWRpby1ncm91cFwiKSwgXCLQntCx0LXRgNGW0YLRjCDQstCw0YDRltCw0L3RglwiKTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBpc01pbGl0YXJ5VmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vINCS0LDQu9GW0LTQsNGG0ZbRjyDQt9Cz0L7QtNC4INC90LAg0L7QsdGA0L7QsdC60YMg0LTQsNC90LjRhVxuICAgICAgICAgICAgY29uc3QgY29uc2VudCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcIi5mb3JtX19pbnB1dC1jaGVja2JveFwiKTtcbiAgICAgICAgICAgIGlmICghY29uc2VudC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgYWRkV2FybmluZyhjb25zZW50LCBcItCS0Lgg0L/QvtCy0LjQvdC90ZYg0L/QvtCz0L7QtNC40YLQuNGB0Y8g0Lcg0L7QsdGA0L7QsdC60L7RjiDQtNCw0L3QuNGFXCIpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY29uc2VudFZhbGlkID0gdHJ1ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3VybmFtZVZhbGlkICYmIGZpcnN0TmFtZVZhbGlkICYmIHNlY29uZE5hbWVWYWxpZCAmJiBwaG9uZVZhbGlkICYmIGJpcnRoRGF0ZVZhbGlkICYmIGlzTWlsaXRhcnlWYWxpZCAmJiBjb25zZW50VmFsaWQpe1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGZvcm1XYXJuaW5nLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICBzdWJtaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnd2FybmluZycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtV2FybmluZy5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgc3VibWl0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWRcbiAgICAgICAgfVxuXG5cbiAgICAgICAgZm9ybXMuZm9yRWFjaChmb3JtID0+IHtcbiAgICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyDQl9Cw0LHQu9C+0LrRg9Cy0LDRgtC4INGB0YLQsNC90LTQsNGA0YLQvdGDINCy0ZbQtNC/0YDQsNCy0LrRg1xuICAgICAgICAgICAgICAgIC8vIHZhbGlkYXRlSW5wdXRzKGZvcm0pXG4gICAgICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSBjaGVja1ZhbGlkKClcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpc1ZhbGlkKVxuXG5cbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRzYWRcIilcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7IC8vXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc01lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVdhcm5pbmcuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZmV0Y2goZm9ybS5hY3Rpb24sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBmb3JtRGF0YVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7IC8vINCS0LjQstC10YHRgtC4INCy0ZbQtNC/0L7QstGW0LTRjCDQstGW0LQg0YHQtdGA0LLQtdGA0LBcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NNZXNzYWdlID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGZvcm0ucXVlcnlTZWxlY3RvcignLmZvcm1fX3dhcm5pbmcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmluY2x1ZGVzKFwi0JTRj9C60YPRlNC80L4g0LfQsCDQstCw0YjRgyDQt9Cw0Y/QstC60YMhXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0L7QutCw0LfQsNGC0Lgg0L/QvtCy0ZbQtNC+0LzQu9C10L3QvdGPINC/0YDQviDRg9GB0L/RltGFXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTsgLy8g0J7Rh9C40YHRgtC40YLQuCDRhNC+0YDQvNGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0L7QutCw0LfQsNGC0Lgg0L/QvtCy0ZbQtNC+0LzQu9C10L3QvdGPINC/0YDQviDQv9C+0LzQuNC70LrRg1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuC4g0KHQv9GA0L7QsdGD0LnRgtC1INGJ0LUg0YDQsNC3LlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCLQn9C+0LzQuNC70LrQsCDQv9GA0Lgg0LLRltC00L/RgNCw0LLRhtGWINGE0L7RgNC80Lg6XCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX193YXJuaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBcItCf0L7QvNC40LvQutCwINC/0YDQuCDQstGW0LTQv9GA0LDQstGG0ZYg0YTQvtGA0LzQuC4g0KHQv9GA0L7QsdGD0LnRgtC1INGJ0LUg0YDQsNC3LlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xufSk7XG5cblxuXG5cblxuIl19
