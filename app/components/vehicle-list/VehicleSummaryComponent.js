import React, {Component} from 'react';
import NumberFormat from 'react-number-format';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './VehicleSummaryComponent.scss';
import {Api} from '../../config/ApplicationContext';

class VehicleSummaryComponent extends Component {
  goToDetails() {
    this.props.history.push({
      pathname: `/details/${this.props.vehicle.publicId}`
    });
  }

  render() {
    const {vehicle} = this.props;
    return (
      <div className="gradient-backdrop">
        <div className="vehicle-summary" role="button" tabIndex="0" onKeyPress={() => { this.goToDetails(); }} onClick={() => { this.goToDetails(); }} >

          <div className="make-and-model">
            <h1 className="vehicle-model">{vehicle.modelYear} {vehicle.modelName}</h1>
            <h2 className="vehicle-make">{vehicle.manufacturerName}</h2>
          </div>
          <div className="vehicle-details">
            <div className="preview-image">
              <img src={Api.resolve(`/media/${vehicle.imageStorageId}`)} alt="Vehicle Thumbnail" />
            </div>
            <div className="features">
              {vehicle.exteriorName} Exterior<br />
              {vehicle.interiorName} Interior<br />
              {vehicle.transmissionName} <br />
              {vehicle.engineTypeName} <br />
              {vehicle.estimatedMileage} <br />
              Seats {vehicle.seatingCapacity} <br />
            </div>
          </div>
          <div className="price-and-action">
            <div className="price-breakdown">
              <span className="price">
                <NumberFormat
                  displayType="text"
                  decimalScale={0}
                  decimalSeparator=""
                  value={Math.ceil(vehicle.basePrice)}
                  prefix="$"
                />
              </span>/month <br />
              <span className="fine-print">base price</span>
            </div>
            <div className="action">
              <button className="csa-button secondary">Check it out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

VehicleSummaryComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  vehicle: PropTypes.shape({
    publicId: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(VehicleSummaryComponent);
