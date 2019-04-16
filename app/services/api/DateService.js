import moment from 'moment';

class DateService {
  static get dateFormat() {
    return /(\d{2})\/(\d{2})\/(\d{4})/;
  }

  static isValidDate(dateString) {
    return DateService.dateFormat.test(dateString) && moment(dateString).isValid();
  }

  static toDate(dateString) {
    if (DateService.isValidDate(dateString)) {
      return moment(dateString).format('YYYY-MM-DD');
    }
    return null;
  }
}

export default DateService;
