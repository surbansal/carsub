import PropTypes from 'prop-types';

const VehicleType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  publicId: PropTypes.string.isRequired,
  imageStorageId: PropTypes.string.isRequired,
  configuration: PropTypes.shape({
    id: PropTypes.number.isRequired,
    exterior: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    interior: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      materialType: PropTypes.string.isRequired,
      colorType: PropTypes.string.isRequired
    }).isRequired,
    transmissionType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    model: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      manufacturer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        exteriors: PropTypes.arrayOf(PropTypes.shape),
        interiors: PropTypes.arrayOf(PropTypes.shape)
      }),
      estimatedMileage: PropTypes.string.isRequired,
      seatingCapacity: PropTypes.string.isRequired,
      horsePower: PropTypes.string.isRequired,
      engineType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
      }),
      features: PropTypes.arrayOf(PropTypes.shape),
      configurations: PropTypes.arrayOf(PropTypes.shape)
    })
  }).isRequired
});

export default VehicleType;
