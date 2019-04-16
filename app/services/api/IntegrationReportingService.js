class IntegrationReportingService {
  constructor(api, shouldReport) {
    this.api = api;
    this.shouldReport = shouldReport;
  }

  reportIntegrationError(vendor, details) {
    if (!this.shouldReport) {
      return;
    }
    const status = {
      vendor,
      status: 'ERROR',
      statusDetails: details
    };

    this.api.post('/integration-history', status);
  }

  reportIntegrationSuccess(vendor, details) {
    if (!this.shouldReport) {
      return;
    }
    const status = {
      vendor,
      status: 'OK',
      statusDetails: details
    };

    this.api.post('/integration-history', status);
  }
}

export default IntegrationReportingService;
