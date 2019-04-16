// eslint-disable-next-line no-unused-vars
import {notify} from 'react-notify-toast';

class DmaApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  resolve(inputUrl) {
    return this.baseUrl + inputUrl;
  }

  get(inputUrl) {
    const url = this.resolve(inputUrl);
    return fetch(url, { credentials: 'include' }).then((response) => {
      if (!response.ok) {
        DmaApiService.checkForUnhandledErrorResponse(response);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(response);
      }
      return response.json();
    });
  }

  post(inputUrl, requestBody) {
    const url = this.resolve(inputUrl);
    return fetch(url, {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        if (!response.ok) {
          DmaApiService.checkForUnhandledErrorResponse(response);
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(response);
        }
        return response.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      });
  }

  static checkForUnhandledErrorResponse(response) {
    if (response.status === 500) {
      notify.show('An unexpected error occurred. Please try again.', 'error');
    }
  }
  static getCsaProgramId() {
    return 'prg_car-subscription';
  }
}

export default DmaApiService;
