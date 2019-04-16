import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {Api} from '../../../config/ApplicationContext';

const PublicImageField = ({source, record = {}}) => {
  const storageId = get(record, source);
  return (
    storageId ? (
      <img src={Api.resolve(`/media/${storageId}`)} alt="Vehicle Thumbnail" />
    ) : (
      <span>No file uploaded</span>
    )
  );
};

/* eslint-disable */
PublicImageField.propTypes = {
  record: PropTypes.shape({}),
  source: PropTypes.string.isRequired,
  addLabel: PropTypes.bool
};
/* eslint-enable */
PublicImageField.defaultProps = {
  addLabel: true,
};

export default PublicImageField;
