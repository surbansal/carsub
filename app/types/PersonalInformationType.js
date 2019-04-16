import PropTypes from 'prop-types';
import PhoneType from './PhoneType';
import AddressType from './AddressType';

const PersonalInformationType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  address: AddressType.isRequired,
  driverLicenseNumber: PropTypes.string.isRequired,
  phone: PhoneType.isRequired
});

export default PersonalInformationType;
