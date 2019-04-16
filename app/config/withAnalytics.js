import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {segmentAnalytics} from '../config/ApplicationContext';

const withAnalytics = (WrappedComponent) => {
  const trackPage = (location) => {
    segmentAnalytics.page(location.pathname + location.search);
  };

  const ComponentWithAnalytics = class extends Component {
    componentDidMount() {
      const page = this.props.location;
      trackPage(page);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  ComponentWithAnalytics.propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  return ComponentWithAnalytics;
};

export default withAnalytics;
