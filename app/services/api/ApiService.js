// eslint-disable-next-line no-unused-vars
import {notify} from 'react-notify-toast';

class ApiService {
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
        ApiService.checkForUnhandledErrorResponse(response);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(response);
      }
      if (response.status === 204) {
        return {};
      }
      return response.json();
    });
  }

  delete(inputUrl, requestBody) {
    const url = this.resolve(inputUrl);
    return fetch(url, {
      credentials: 'include',
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }).then((response) => {
      if (!response.ok) {
        ApiService.checkForUnhandledErrorResponse(response);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(response);
      }
      return response.text().then((text) => {
        return text ? JSON.parse(text) : {};
      });
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
          ApiService.checkForUnhandledErrorResponse(response);
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(response);
        }
        return response.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      });
  }

  put(inputUrl, requestBody) {
    const url = this.resolve(inputUrl);
    return fetch(url, {
      method: 'put',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }).then((response) => {
      if (!response.ok) {
        ApiService.checkForUnhandledErrorResponse(response);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(response);
      }
      return response.text().then((text) => {
        return text ? JSON.parse(text) : {};
      });
    });
  }
  upload(inputUrl, requestBody, requestMethod) {
    const url = this.resolve(inputUrl);
    const formData = new FormData();
    formData.append('file', requestBody);
    return fetch(url, {
      method: requestMethod || 'post',
      credentials: 'include',
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          ApiService.checkForUnhandledErrorResponse(response);
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(response);
        }
        return response.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      });
  }

  login(requestBody) {
    const url = this.resolve('/login');
    return fetch(url, {
      method: 'post',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: ApiService.getFormUrlEncoded(requestBody)
    })
      .then((response) => {
        if (!response.ok) {
          ApiService.checkForUnhandledErrorResponse(response);
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(response);
        }
        return response.json();
      });
  }

  static checkForUnhandledErrorResponse(response) {
    if (response.status === 500) {
      notify.show('An unexpected error occurred. Please try again.', 'error');
    }
  }

  static getFormUrlEncoded(toConvert) {
    const formBody = [];
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const property in toConvert) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(toConvert[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    return formBody.join('&');
  }
}

export default ApiService;
