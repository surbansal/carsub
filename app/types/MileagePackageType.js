import PropTypes from 'prop-types';

const MileagePackageType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired
});

export default MileagePackageType;
