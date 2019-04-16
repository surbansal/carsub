import {segmentAnalytics} from '../config/ApplicationContext';

class ThirdPartyAnalytics {
  static event(event) {
    segmentAnalytics.track(event.action, {
      category: event.category
    });
    window.uetq = window.uetq || [];
    window.uetq.push('event', event.category, {event_category: event.action, event_label: event.action, event_value: 0});

    if (window.fbq) {
      window.fbq('trackCustom', event.category);
    }
  }
}

export default ThirdPartyAnalytics;
