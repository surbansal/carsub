import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import '../commonAdmin.scss';

const AddressField = ({ source, record = {}, label }) => {
  const address = get(record, source);

  if (!address) {
    return null;
  }
  return (
    <div className="custom-field address-field">
      <label htmlFor="address">
        {label || source} <br />
      </label>
      <span id="address">
        {address.streetAddress}<br />
        {address.streetAddress2 &&
          <span>{address.streetAddress2}<br /></span>
        }
        {address.city}, {address.state} {address.zipCode}
      </span>
    </div>
  );
};

AddressField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.shape({}),
  source: PropTypes.string.isRequired,
};

AddressField.defaultProps = {
  label: null,
  record: {}
};

export default AddressField;
