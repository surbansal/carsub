import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VehicleSummaryComponent from './VehicleSummaryComponent';
import VehicleType from '../../types/VehicleType';
import './VehicleListComponent.scss';

class VehicleListComponent extends Component {
  renderAvailableVehiclesForMatch(isFullMatch) {
    return this.props.vehicles
      .filter(vehicle => (vehicle.vehicleStatus === 'AVAILABLE' && vehicle.isFullyMatched === isFullMatch))
      .map((vehicle) => {
        return (
          <div key={vehicle.id} className="list-item">
            <VehicleSummaryComponent vehicle={vehicle} />
          </div>
        );
      });
  }

  renderUnavailableVehiclesForMatch(isFullMatch) {
    return this.props.vehicles
      .filter(vehicle => (vehicle.vehicleStatus !== 'AVAILABLE' && vehicle.isFullyMatched === isFullMatch))
      .map((vehicle) => {
        return (
          <div key={vehicle.id} className="list-item unavailable">
            <VehicleSummaryComponent vehicle={vehicle} isUnavailable />
          </div>
        );
      });
  }

  render() {
    const availableFullMatchVehicles = this.renderAvailableVehiclesForMatch(true);
    const unavailableFullMatchVehicles = this.renderUnavailableVehiclesForMatch(true);
    const fullMatchVehiclesCount = availableFullMatchVehicles.concat(unavailableFullMatchVehicles).length;

    const availablePartialMatchVehicles = this.renderAvailableVehiclesForMatch(false);
    const unavailablePartialMatchVehicles = this.renderUnavailableVehiclesForMatch(false);
    const partialMatchVehiclesCount = availablePartialMatchVehicles.concat(unavailablePartialMatchVehicles).length;

    return (
      <div className="vehicle-list-wrapper">
        <div className="vehicle-list">
          {availableFullMatchVehicles}
          {unavailableFullMatchVehicles}
          {fullMatchVehiclesCount % 2 === 1 && <div className="list-item" />}
        </div>

        {sessionStorage.getItem('isFilterApplied') === 'true' && (
          <div className="vehicle-list">
            <div className={`vehicle-availability-info-box ${fullMatchVehiclesCount === 0 ? 'vehicle-top' : ''}`}>
              <div className="vehicle-availability-message">
                No {fullMatchVehiclesCount > 0 ? 'more' : ''} vehicles match all the filters you chose.
                {partialMatchVehiclesCount === 0 && (
                  <button className="link-button bold" onClick={() => { this.props.onResetVehicleFilters(); window.scrollTo(0, 0); }}>Reset all filters</button>
                )}
              </div>
            </div>
            {partialMatchVehiclesCount > 0 && (
              <div className="vehicle-availability-subtext">
                Here are more vehicles available in your area:
              </div>
            )}
            {partialMatchVehiclesCount === 0 && (
              <button className="reset-filters-button link-button mobile-only" onClick={() => { this.props.onResetVehicleFilters(); window.scrollTo(0, 0); }}>Reset All Filters</button>
            )}
          </div>
        )}

        {partialMatchVehiclesCount > 0 &&
          <div className="vehicle-list">
            {availablePartialMatchVehicles}
            {unavailablePartialMatchVehicles}
            {partialMatchVehiclesCount % 2 === 1 && <div className="list-item" />}
          </div>
        }
      </div>
    );
  }
}

VehicleListComponent.propTypes = {
  vehicles: PropTypes.arrayOf(VehicleType).isRequired,
  onResetVehicleFilters: PropTypes.func.isRequired
};

export default VehicleListComponent;
