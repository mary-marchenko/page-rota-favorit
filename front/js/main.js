//fade-in when visible
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in, .slideInLeft, .slideInRight, .fadeInFromTop");

    function checkVisibility() {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
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
    const btn = document.querySelector(".header__content-btn");
    const form = document.querySelector(".firstForm");

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
    const sliderWrapper = document.querySelector(".slider__wrapper");
    const slides = document.querySelectorAll(".slider__slide");
    const prevBtn = document.querySelector(".slider__btn-prev");
    const nextBtn = document.querySelector(".slider__btn-next");
    const dotsContainer = document.querySelector(".slider__dots");
    let currentIndex = 0;
    let interval;
    let touchStartX = 0;
    let touchEndX = 0;

    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.remove("active", "opacity")
            slide.classList.add(`${index === currentIndex ? "active" : "opacity"}`)
        });
        document.querySelectorAll(".slider__dot").forEach((dot, index) => {
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
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            prevSlide();
        }
    }

    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("slider__dot");
        dot.addEventListener("click", () => {
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
document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll('form');  // Все формы на странице

    forms.forEach(form => {
        const phoneInput = form.querySelector('.form__input-phone');
        const dateInput = form.querySelector('.form__input-date');
        const regionInput = form.querySelector('.form__input-region');
        const checkboxInput = form.querySelector('.form__input-checkbox');
        const radioInputs = form.querySelectorAll('input[name="yes-no"]'); // Для проверки военнослужащего
        const submitButton = form.querySelector('.form__submit');
        const allInputs = form.querySelectorAll('.form__input');
        const telegramInput = form.querySelector('.form__input-telegram'); // Нік в телеграмі
        const formWarning = form.querySelector('.form__warning');  // Контейнер для предупреждений

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
            let rawDigits = this.value.replace(/\D/g, ''); // Оставляем только цифры

            // Если пытаются ввести цифру, а уже 12 цифр – запрещаем ввод
            if (rawDigits.length >= 12 && /\d/.test(e.data)) {
                e.preventDefault();
            }
        });

        phoneInput.addEventListener('input', function () {
            let rawDigits = this.value.replace(/\D/g, ''); // Убираем все нецифровые символы
            let cursorPos = this.selectionStart; // Запоминаем позицию каретки

            // Формируем форматированный номер
            let formattedValue = '+38';
            if (rawDigits.length > 2) formattedValue += ' ' + rawDigits.slice(2, 5);
            if (rawDigits.length > 5) formattedValue += ' ' + rawDigits.slice(5, 8);
            if (rawDigits.length > 8) formattedValue += ' ' + rawDigits.slice(8, 10);
            if (rawDigits.length > 10) formattedValue += ' ' + rawDigits.slice(10, 12);

            // Запоминаем количество цифр до курсора
            let digitsBeforeCursor = this.value.slice(0, cursorPos).replace(/\D/g, '').length;

            this.value = formattedValue;

            // Определяем новую позицию каретки
            let newCursorPos = 3; // Начинаем после +38
            let digitCount = 0;

            for (let i = 0; i < formattedValue.length; i++) {
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
            const parts = this.value.split('-');
            if (parts[0] && parts[0].length > 4) {
                parts[0] = parts[0].slice(0, 4);
                this.value = parts.join('-');
            }
        });

        //input
        form.addEventListener('input', (event) => {
            const targetInput = event.target;

            if (targetInput.classList.contains('warning')) {
                validateSingleInput(targetInput);
            }

            const isAnyInputFilled = Array.from(allInputs).some(input => input.value.trim() !== "" || input.checked);
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
            } else if (input.value.trim() === "" || (input.classList.contains('form__input-phone') && !/^\+38\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2}$/.test(input.value))) {
                input.classList.add('warning');
            } else if (input.classList.contains('form__input-region') && input.value === "") {
                input.classList.add('warning');
            } else if (input.classList.contains('form__input-checkbox') && !input.checked) {
                input.classList.add('warning');
            } else if (input.classList.contains('form__input-radio')) {
                const isRadioChecked = Array.from(radioInputs).some(radio => radio.checked);
                if (!isRadioChecked) {
                    radioInputs.forEach(radio => radio.classList.add('warning'));
                } else {
                    radioInputs.forEach(radio => radio.classList.remove('warning'));
                }
            } else {
                input.classList.remove('warning');
            }
        }

        // validation

        function  checkValid(){
            let isValid = false
            const warnings = form.querySelectorAll(".warning");
            warnings.forEach(warning => warning.classList.remove("warning")); // Очистити попередні помилки

            const addWarning = (input, message) => {

                isValid = false;
                input.classList.add("warning");
                let warningMessage = input.nextElementSibling;
                if (!warningMessage || !warningMessage.classList.contains("form__warning")) {
                    warningMessage = document.createElement("p");
                    warningMessage.classList.add("form__warning");
                    warningMessage.textContent = message;
                    input.parentNode.appendChild(warningMessage);
                }
            };

            let surnameValid = false
            let firstNameValid = false
            let secondNameValid = false
            let phoneValid = false
            let birthDateValid = false
            let isMilitaryValid = false
            let consentValid = false


            const surname = form.querySelector(".form__input-surname");
            surname.addEventListener("input", () =>{
                if (!surname.value.trim()) addWarning(surname, "Прізвище обов'язкове");
            })
            if (!surname.value.trim()) {
                addWarning(surname, "Прізвище обов'язкове");

            }else{
                surnameValid = true
            }

            const firstName = form.querySelector(".form__input-first-name");
            if (!firstName.value.trim()) {
                addWarning(firstName, "Ім'я обов'язкове");

            }else{
                firstNameValid = true
            }

            const secondName = form.querySelector(".form__input-middle-name");
            if (!secondName.value.trim()) {
                addWarning(secondName, "По батькові обов'язкове");


            }else{
                secondNameValid = true
            }

            const phone = form.querySelector(".form__input-phone");
            if (!phone.value.trim() || !/^\+38\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(phone.value)) {
                addWarning(phone, "Номер телефону обов'язковий");

            }else{
                phoneValid = true
            }

            const birthDate = form.querySelector(".form__input-date");
            if (!birthDate.value || birthDate.value === "2000-01-01") {
                addWarning(birthDate, "Дата народження обов'язкова");
            }else{
                birthDateValid = true
            }

            const isMilitary = form.querySelector(".form__input-radio:checked");
            if (!isMilitary){
                addWarning(form.querySelector(".form__radio-group"), "Оберіть варіант");
            }else {
                isMilitaryValid = true
            }

            const consent = form.querySelector(".form__input-checkbox");
            if (!consent.checked) {
                addWarning(consent, "Ви повинні погодитися з обробкою даних");
            }else{
                consentValid = true
            }

            if (surnameValid && firstNameValid && secondNameValid && phoneValid && birthDateValid && isMilitaryValid && consentValid){
                isValid = true
            }

            if (!isValid) {
                formWarning.classList.add('visible');
                submitButton.classList.add('warning');
            } else {
                formWarning.classList.remove('visible');
                submitButton.classList.remove('warning');
            }

            return isValid
        }


        forms.forEach(form => {
            form.addEventListener("submit", (event) => {
                event.preventDefault(); // Заблокувати стандартну відправку

                let isValid = checkValid();
                // console.log(isValid);

                if (isValid) {
                    const formData = new FormData(form);

                    const successMessage = form.querySelector('.form__success');
                    if (successMessage) {
                        successMessage.classList.add('visible');

                        setTimeout(() => {
                            successMessage.classList.remove('visible');
                            formWarning.classList.add('visible');
                            form.reset();
                        }, 5000);

                        successMessage.addEventListener('click', () => {
                            successMessage.classList.remove('visible');
                            formWarning.classList.add('visible');
                            form.reset();
                        });
                    }

                    fetch(form.action, {
                        method: "POST",
                        body: formData
                    })
                        .then(response => response.text())
                        .then(data => {
                            // console.log(data); // Вивести відповідь від сервера

                            const successMessage = form.querySelector('.form__success');
                            const errorMessage = form.querySelector('.form__warning');

                            if (data.includes("Дякуємо за вашу заявку!")) {
                                // Показати повідомлення про успіх
                                if (successMessage) {
                                    successMessage.classList.add('visible');
                                    setTimeout(() => {
                                        successMessage.classList.remove('visible');
                                        form.reset(); // Очистити форму
                                    }, 5000);
                                }
                            } else {
                                // Показати повідомлення про помилку
                            }
                        })
                        .catch(error => {
                            console.error("Помилка при відправці форми:", error);
                            const errorMessage = form.querySelector('.form__warning');
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



