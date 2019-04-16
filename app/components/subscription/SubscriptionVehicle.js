import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VehicleType from '../../types/VehicleType';
import './SubscriptionVehicle.scss';
import {Api} from '../../config/ApplicationContext';

class SubscriptionVehicle extends Component {
  componentDidMount() {
  }

  render() {
    const {vehicle} = this.props;
    return (
      <div className="subscription-vehicle-container">
        <div className="subscription-vehicle">
          <h1>{vehicle.configuration.model.name}</h1>
          <div className="confirmation-item">
            <img src={Api.resolve(`/media/${vehicle.imageStorageId}`)} alt={vehicle.publicId} />
          </div>
          <div className="confirmation-item">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

SubscriptionVehicle.propTypes = {
  vehicle: VehicleType.isRequired,
  children: PropTypes.element.isRequired
};

export default SubscriptionVehicle;
