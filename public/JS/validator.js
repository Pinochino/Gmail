"use strict";

(function () {

    window.addEventListener("load", init);

    const usernameValue = id('username');
    const emailValue = id('email');
    const passwordValue = id('password');
    const confirmPasswordValue = id('confirmPassword');

    let usernameMessage = id('nameError');
    let emailMessage = id('emailError');
    let passwordMessage = id('passwordError');
    let confirmPasswordMessage = id('confirmPasswordError');

    function init() {
        // Add event listener to form submit button
        const form = id('form-1');
        form.addEventListener('submit', validateForm, {
            once: true
        })

        // Add event listeners to input fields for real-time validation
        usernameValue.addEventListener('input', validateName);
        emailValue.addEventListener('input', validateEmail);
        passwordValue.addEventListener('input', validatePassword);
        confirmPasswordValue.addEventListener('input', validateConfirmPassword);
    }

    function validateForm(event) {
        // Prevent form from submitting if there are validation errors
        event.preventDefault();

        let isValid = validateName() && validateEmail() && validatePassword() && validateConfirmPassword();
        if (isValid) {
            event.target.submit();
        }
    }


    function validateName() {
        const name = usernameValue.value;
        if (name.length === 0) {
            usernameMessage.textContent = '';
            return false;
        } else if (name.length < 3) {
            usernameMessage.textContent = 'Your name must be at least 3 characters';
            return false;
        }
        usernameMessage.textContent = '';
        return true;
    }

    function validateEmail() {
        const email = emailValue.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length === 0) {
            emailMessage.textContent = '';
            return false;
        } else if (!email.match(emailRegex)) {
            emailMessage.textContent = 'Your email must be a valid email address';
            return false;
        }
        emailMessage.textContent = '';
        return true;
    }

    function validatePassword() {
        const password = passwordValue.value;
        const passwordRegex = /^(?=\S)(?!.*\s).{6,}$/;
        if (password.length === 0) {
            passwordMessage.textContent = '';
            return false;
        } else if (!password.match(passwordRegex) && password.length < 6) {
            passwordMessage.textContent = 'Password must be at least 6 characters and contain no spaces';
            return false;
        }
        passwordMessage.textContent = '';
        return true;
    }

    function validateConfirmPassword() {
        const password = passwordValue.value;
        const confirmPassword = confirmPasswordValue.value;
        if (confirmPassword.length === 0) {
            confirmPasswordMessage.textContent = '';
            return false;
        } else if (password !== confirmPassword) {
            confirmPasswordMessage.textContent = 'Passwords do not match';
            return false;
        }
        confirmPasswordMessage.textContent = '';
        return true;
    }
    function id(id) {
        return document.getElementById(id);
    }

    function qs(selector) {
        return document.querySelector(selector);
    }

})();

window.addEventListener('load', openPassword);

const usernameValue = document.getElementById('username');
const passwordValue = document.getElementById('password');

function openPassword() {
    const closeEye = document.querySelector(".fa-regular.fa-eye");
    const openEye = document.querySelector('.fa-regular.fa-eye-slash');


    closeEye.addEventListener('click', () => {
        closeEye.classList.add('hidden');
        openEye.classList.remove('hidden');
        passwordValue.setAttribute('type', 'text')
    })

    openEye.addEventListener('click', () => {
        openEye.classList.add('hidden');
        closeEye.classList.remove('hidden');
        passwordValue.setAttribute('type', 'password')
    })
}