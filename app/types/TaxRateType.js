import PropTypes from 'prop-types';

const TaxRateType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  state: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  taxRegion: PropTypes.string.isRequired,
  stateRate: PropTypes.number.isRequired,
  estimatedCombinedRate: PropTypes.number.isRequired,
  riskLevel: PropTypes.number.isRequired
});

export default TaxRateType;
