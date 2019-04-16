/* eslint-disable no-undef,class-methods-use-this */

const segmentIntegrationEnabled = '#{segmentIntegrationEnabled}';
const enableSegmentIntegration = segmentIntegrationEnabled === 'true';

class SegmentAnalytics {
  page(data) {
    if (enableSegmentIntegration) {
      analytics.page(data);
    }
  }

  track(action, eventMetadata) {
    analytics.track(action, eventMetadata);
  }

  identify(traits) {
    if (enableSegmentIntegration) {
      analytics.identify(traits);
    }
  }

  identifyUser(userId, traits) {
    if (enableSegmentIntegration) {
      analytics.identify(userId, traits);
    }
  }
}
export default SegmentAnalytics;
