import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Button from '@material-ui/core/Button';
import {Api} from '../../../config/ApplicationContext';

const MediaFileField = ({source, record = {}}) => {
  const storageId = get(record, source);
  return (
    storageId ? (
      <Button color="primary" onClick={() => MediaFileField.downloadFile(storageId)}>Download</Button>
    ) : (
      <span>No file uploaded</span>
    )
  );
};

MediaFileField.downloadFile = (storageId) => {
  Api.get(`/admin/media/${storageId}`).then((response) => {
    window.open(response.location);
  });
};
/* eslint-disable */
MediaFileField.propTypes = {
  record: PropTypes.shape({}),
  source: PropTypes.string.isRequired,
  addLabel: PropTypes.bool
};
/* eslint-enable */
MediaFileField.defaultProps = {
  addLabel: true,
};

export default MediaFileField;
