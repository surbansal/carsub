class LogService {
  constructor(api) {
    this.api = api;
  }
  logErrors(message, level, category, userId, leadId) {
    const request = {
      level, message, userId, leadId, currentPage: window.location.pathname, category
    };
    this.api.post('/logs', request);
  }
}

export default LogService;
