import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {integrationReportingService} from '../../config/ApplicationContext';

class SpinCar extends Component {
  componentDidMount() {
    setTimeout(() => {
      const spincarPresent = document.querySelector && document.querySelector('.sts-spin');
      if (spincarPresent) {
        integrationReportingService.reportIntegrationError('SPINCAR', 'Spincar element was not loaded within 10 seconds after page load');
      } else {
        integrationReportingService.reportIntegrationSuccess('SPINCAR', 'Spincar element was succesfully loaded within 10 seconds after page load');
      }
    }, 10000);
  }

  render() {
    const zip = this.props.spincarId.toLowerCase();
    return (
      <div className="spin-car" data-vin={zip} />
    );
  }
}

SpinCar.propTypes = {
  spincarId: PropTypes.string.isRequired
};

export default SpinCar;
