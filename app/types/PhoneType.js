import PropTypes from 'prop-types';

const PhoneType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  isVerified: PropTypes.bool.isRequired
});

export default PhoneType;
