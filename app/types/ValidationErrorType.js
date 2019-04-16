import PropTypes from 'prop-types';

const ValidationErrorType = PropTypes.shape({
  validationErrors: PropTypes.arrayOf(PropTypes.shape({
    property: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }))
});

export default ValidationErrorType;
