import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './VehicleModelFilterComponent.scss';

class VehicleModelFilterComponent extends Component {
  render() {
    return (
      <div>
        <div>
          <label htmlFor="make-model">Make / Model </label>
        </div>
        <div className="filter-model-wrapper">
          {this.props.partiallyFilteredVehicleModels.map(model =>
            (
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={model.checked}
                  onChange={() => this.props.updateModelFilter(model.index)}
                />
                <span>{model.label}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
}


VehicleModelFilterComponent.propTypes = {
  updateModelFilter: PropTypes.func.isRequired,
  partiallyFilteredVehicleModels: PropTypes.arrayOf(PropTypes.shape).isRequired
};

export default VehicleModelFilterComponent;
