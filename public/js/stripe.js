/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_6YwODgfclgA0Ny6FHwkMvb1O00c8Uzxs0p');

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
