import cookie from 'react-cookies';
import {isMobileOnly, isTablet} from 'react-device-detect';
import {Api, DmaApi} from '../../config/ApplicationContext';

class ZipCodeService {
  static setZipCode(zip) {
    const deviceType = ZipCodeService.getDeviceType();
    return ZipCodeService.setClub(zip, deviceType);
  }

  static setClub(zip, deviceType) {
    return Api.get(`/clubs/${zip}`).then((resp) => {
      const zipCookie = `${zip}|AAA|${resp.clubNumber}|${deviceType}}`;
      if (ZipCodeService.isAAA()) {
        ZipCodeService.setCookie('zipcode', zipCookie, '.aaa.com');
      } else {
        ZipCodeService.setCookie('zipcode', zipCookie);
      }
      if (!resp.inRegion) {
        window.location.href = 'https://www.aaa.com';
        return 'flag';
      }
      return zipCookie;
    }).catch(() => {
      return null;
    });
  }

  static getZipCookie() {
    const aaaCookie = cookie.load('zipcode', {domain: '.aaa.com'});
    return (aaaCookie) || cookie.load('zipcode', {domain: window.location.hostname});
  }

  static setCookie(key, value, domain) {
    if (!domain) {
      cookie.save(key, value);
    } else {
      cookie.save(key, value, {domain});
    }
    if (ZipCodeService.listeners) {
      ZipCodeService.listeners.forEach(fn => fn());
    }
    if (ZipCodeService.isAAARedirect()) {
      if (window.history && window.history.pushState) {
        const params = new URLSearchParams(window.location.search);
        params.delete('zip');
        params.delete('devicecd');
        window.history.pushState('', '', `${window.location.pathname}?${params.toString()}`);
      }
    }
  }

  static isZipCodeServiceable() {
    const zip = this.extractZipCode();
    return DmaApi.get(`/zips/${zip}/area`).then((response) => {
      return response.status.name === 'Serviceable';
    }).catch(() => {
      return Promise.resolve(false);
    });
  }

  static checkAndNavigateOutOfRegionUsers() {
    const zip = this.extractZipCode();
    if (zip) {
      Api.get(`/clubs/${zip}`).then((resp) => {
        if (!resp.inRegion) {
          window.location.href = 'https://www.aaa.com';
        }
      });
    }
  }

  static isAAA() {
    return window.location.hostname.endsWith('aaa.com');
  }

  static extractZipCode() {
    const zipData = this.getZipCookie();
    if (!zipData || zipData.indexOf('|') === -1) {
      return null;
    }
    return zipData.split('|')[0];
  }

  static getDeviceType() {
    let deviceType;
    if (isMobileOnly) {
      deviceType = 'SP';
    } else if (isTablet) {
      deviceType = 'TB';
    } else {
      deviceType = 'PC';
    }
    return deviceType;
  }

  static onChange(fn) {
    ZipCodeService.listeners = ZipCodeService.listeners || [];
    ZipCodeService.listeners.push(fn);
  }

  static isAAARedirect() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('zip') && params.get('devicecd'));
  }
}

export default ZipCodeService;
