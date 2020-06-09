/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, signup, forgot, reset } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const forgotForm = document.querySelector('.form--forgot');
const resetForm = document.querySelector('.form--reset');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save--password').textContent = 'Updating ...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    document.querySelector('.btn--save--password').textContent = 'Save password';
  });

if (bookBtn)
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing ...';

    const { tourId } = e.target.dataset;

    await bookTour(tourId);

    e.target.textContent = 'Book tour now!';
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 15);

if (signupForm)
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.target.lastChild.lastChild.textContent = 'Processing ...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await signup(name, email, password, passwordConfirm);
    e.target.lastChild.lastChild.textContent = 'Sign Up';
  });

if (forgotForm)
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.target.lastChild.lastChild.textContent = 'Processing ...';
    const email = document.getElementById('email').value;
    await forgot(email);
    e.target.lastChild.lastChild.textContent = 'Send Email';
  });

if (resetForm)
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.target.lastChild.lastChild.textContent = 'Processing ...';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const resetToken = new URLSearchParams(window.location.search).get('resetToken');
    await reset(password, passwordConfirm, resetToken);
    e.target.lastChild.lastChild.textContent = 'Change password';
  });
