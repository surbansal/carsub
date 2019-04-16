import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import '../commonAdmin.scss';

const getMilesPercentage = (subscriptionUsage, mileageLimit) => {
  const currentMileage = subscriptionUsage.currentVehicleMileage;
  const startingMileage = subscriptionUsage.vehicleStartingMileage;
  const milesDriven = currentMileage - startingMileage;
  if (milesDriven < 0) {
    return 0;
  }
  return Math.round((milesDriven / mileageLimit) * 100);
};

const MilesPercentageField = ({ source, record = {}, label}) => {
  const subscriptionUsage = get(record, source);
  const mileageLimit = get(record, 'mileageLimit');

  return (
    <div className="custom-field miles-percent">
      <label htmlFor="label">
        {label} <br />
      </label>
      <span className="value">{getMilesPercentage(subscriptionUsage, mileageLimit)}</span>
    </div>
  );
};

MilesPercentageField.defaultProps = {
  label: null,
  record: {}
};

MilesPercentageField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.shape({}),
  source: PropTypes.string.isRequired,
};

export default MilesPercentageField;
