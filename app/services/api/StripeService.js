import {Api} from '../../config/ApplicationContext';

class StripeService {
  constructor(api) {
    this.api = api;
  }

  getPublicKey() {
    if (this.stripePublicKey) {
      return Promise.resolve(this.stripePublicKey);
    }
    return Api.get('/configuration').then((response) => {
      this.stripePublicKey = response.stripePublicKey;
      return this.stripePublicKey;
    });
  }
}

export default StripeService;
