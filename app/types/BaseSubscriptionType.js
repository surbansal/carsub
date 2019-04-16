import PropTypes from 'prop-types';
import VehicleType from './VehicleType';

const BaseSubscriptionType = PropTypes.shape({
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  vehicle: VehicleType.isRequired,
  deliveryDate: PropTypes.string.isRequired,
  timeFrame: PropTypes.shape({
    displayName: PropTypes.string.isRequired
  }),
  subscriptionOptions: PropTypes.shape.isRequired,
  status: PropTypes.string.isRequired
});

export default BaseSubscriptionType;
