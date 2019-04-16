import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import '../commonAdmin.scss';

const getMilesDriven = (subscriptionUsage) => {
  const milesDriven = subscriptionUsage.currentVehicleMileage - subscriptionUsage.vehicleStartingMileage;
  if (milesDriven < 0) {
    return 0;
  }
  return milesDriven;
};

const MilesDrivenField = ({ source, record = {}, label}) => {
  const subscriptionUsage = get(record, source);

  return (
    <div className="custom-field miles-driven">
      <label htmlFor="label">
        {label} <br />
      </label>
      <span className="value">{getMilesDriven(subscriptionUsage)}</span>
    </div>
  );
};

MilesDrivenField.defaultProps = {
  label: null,
  record: {}
};

MilesDrivenField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.shape({}),
  source: PropTypes.string.isRequired,
};
export default MilesDrivenField;
