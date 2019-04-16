import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import '../commonAdmin.scss';

const SubscriptionField = ({ source, record = {} }) => {
  const subscription = get(record, source);

  return (
    <div className="custom-field subscription-field">
      <span id="subscription">
        {subscription ? 'Done' : 'Pending'}
      </span>
    </div>
  );
};

SubscriptionField.propTypes = {
  record: PropTypes.shape({}),
  source: PropTypes.string.isRequired,
};

SubscriptionField.defaultProps = {
  record: {}
};

export default SubscriptionField;
