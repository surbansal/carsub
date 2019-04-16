import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Moment from 'react-moment';
import '../commonAdmin.scss';

const DateField = ({ source, record, format}) => {
  const date = get(record, source);
  return (
    <span>
      {date ? <Moment date={date} format={format} /> : <span>--</span>}
    </span>
  );
};

/* eslint-disable */
DateField.propTypes = {
  addLabel: PropTypes.bool,
  record: PropTypes.shape({}),
  source: PropTypes.string.isRequired,
  format: PropTypes.string
};
/* eslint-enable */

DateField.defaultProps = {
  addLabel: true,
  record: {},
  format: 'MM/DD/YYYY h:mm:ss a'
};

export default DateField;
