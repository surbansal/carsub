import PropTypes from 'prop-types';

const TimeFrameType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  displayName: PropTypes.string.isRequired
});

export default TimeFrameType;
