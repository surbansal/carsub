import {createClient} from 'contentful';
import ApiService from '../services/api/ApiService';
import UserService from '../services/user/UserService';
import StripeService from '../services/api/StripeService';
import DmaApiService from '../services/api/DmaApiService';
import IntegrationReportingService from '../services/api/IntegrationReportingService';
import LogService from '../services/api/LogService';
import SegmentAnalytics from '../config/SegmentAnalytics';
import ContractService from '../services/api/ContractService';

const params = new URLSearchParams(window.location.search);
const ContentfulService =
  params.get('preview') === 'true' ?
    createClient({
      space: 'eeebishyjg0j',
      accessToken: '0360326921f05a05fe5100d570c15e7a0a04a7c0e3ce6f5f1b3ac357d6a753c4',
      host: 'preview.contentful.com'
    }) : createClient({
      space: 'eeebishyjg0j',
      accessToken: 'bf3fd76c49fa8fcd95cc2dbefca979478725b1f99a046500b68d0ab9ef6f58eb'
    });

const reportIntegrationErrors = params.get('reportErrors') === 'true';

const apiBackend = '#{apiBackend}';
const dmaBackend = '#{dmaBackend}';
const enableProgressiveWebapp = '#{enablePWA}';
const isProgressiveWebappEnabled = enableProgressiveWebapp === 'true';

const Api = new ApiService(apiBackend || `http://${location.hostname}:8080/api`);
const DmaApi = new DmaApiService(dmaBackend || `http://${location.hostname}:8082/api`);
const userService = new UserService(Api);
const contractService = new ContractService(Api);
const stripeService = new StripeService(Api);
const integrationReportingService = new IntegrationReportingService(Api, reportIntegrationErrors);
const segmentAnalytics = new SegmentAnalytics();
const logService = new LogService(Api);

if (reportIntegrationErrors) {
  ContentfulService.getContentTypes().then(() => {
    integrationReportingService.reportIntegrationSuccess('CONTENTFUL_FRONTEND', 'Successfully integrated with contentful');
  }).catch(() => {
    integrationReportingService.reportIntegrationError('CONTENTFUL_FRONTEND', 'Failure when connecting to contentful from automated UI test');
  });
}

/* eslint-disable */
export {Api, ContentfulService, userService, stripeService, isProgressiveWebappEnabled, reportIntegrationErrors, integrationReportingService, logService, DmaApi, segmentAnalytics, contractService};
/* eslint-enable */
