import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VehicleColorFilterComponent.scss';

class VehicleColorFilterComponent extends Component {
  render() {
    return (
      <div>
        <div>
          <label htmlFor="vehicle-color">Color</label>
        </div>
        <div className="filter-color-wrapper">
          {this.props.partiallyFilteredVehicleColors.map(vehicleColor =>
            (
              <div className={`checkbox-wrapper color-${vehicleColor.checkMarkColor}`}>
                <input
                  style={{ backgroundColor: vehicleColor.backgroundHexCode }}
                  type="checkbox"
                  checked={vehicleColor.checked}
                  onChange={() => this.props.updateColorFilter(vehicleColor.index)}
                />
                <span>{vehicleColor.displayName}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
}


VehicleColorFilterComponent.propTypes = {
  updateColorFilter: PropTypes.func.isRequired,
  partiallyFilteredVehicleColors: PropTypes.arrayOf(PropTypes.shape).isRequired
};

export default VehicleColorFilterComponent;
