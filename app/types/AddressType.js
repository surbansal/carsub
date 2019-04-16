import PropTypes from 'prop-types';

const AddressType = PropTypes.shape({
  id: PropTypes.number,
  publicId: PropTypes.string,
  streetAddress: PropTypes.string.isRequired,
  streetAddress2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
});

export default AddressType;
