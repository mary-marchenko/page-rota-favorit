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

    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.style.display = index === currentIndex ? "flex" : "none";
        });
        document.querySelectorAll(".slider__dot").forEach((dot, index) => {
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

    updateSlider();
    startAutoSlide();
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

        // telephone
        phoneInput.addEventListener('focus', function () {
            if (phoneInput.value.trim() === '') {
                phoneInput.value = '+38'; // Автозаполнение при фокусе
            }
        });

        phoneInput.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');

            if (value.length > 1) {
                value = '+38 ' + value.slice(2, 5) + ' ' + value.slice(5, 8) + ' ' + value.slice(8, 10) + ' ' + value.slice(10, 12);
            } else {
                value = '+38';
            }

            this.value = value;
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
        function validateInputs(form) {
            let isValid = true;
            let hasWarning = false;

            allInputs.forEach(input => {
                if (input === telegramInput) {
                    return;
                }

                if (input.type === "date" && input.value === "2000-01-01") {
                    input.classList.add('warning');
                    hasWarning = true;
                    isValid = false;
                } else if (input.value.trim() === "" || (input.classList.contains('form__input-phone') && !/^\+38\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2}$/.test(input.value))) {
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
                    const isRadioChecked = Array.from(radioInputs).some(radio => radio.checked);
                    if (!isRadioChecked) {
                        radioInputs.forEach(radio => radio.classList.add('warning'));
                        hasWarning = true;
                        isValid = false;
                    } else {
                        radioInputs.forEach(radio => radio.classList.remove('warning'));
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
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            let isValid = true;
            validateInputs(form);

            if (form.querySelector('.warning')) {
                isValid = false;
            }

            if (isValid) {
                const successMessage = form.querySelector('.form__success');
                const formData = {
                    surname: form.querySelector(".form__input-surname").value.trim(),
                    firstName: form.querySelector(".form__input-first-name").value.trim(),
                    middleName: form.querySelector(".form__input-middle-name").value.trim(),
                    phone: form.querySelector(".form__input-phone").value.trim(),
                    birthDate: form.querySelector(".form__input-date").value,
                    telegramNick: form.querySelector(".form__input-telegram").value.trim(),
                    region: form.querySelector(".form__input-region").value,
                    isMilitary: form.querySelector(".form__input-radio:checked")?.value || "no",
                    consent: form.querySelector(".form__input-checkbox").checked,
                };

                console.log("Form Data:", formData);
                if (successMessage) {
                    successMessage.classList.add('visible');

                    setTimeout(() => {
                        successMessage.classList.remove('visible');
                        form.reset();
                    }, 5000);

                    successMessage.addEventListener('click', () => {
                        successMessage.classList.remove('visible');
                        form.reset();
                    });
                }
            }
        });
    });
});





