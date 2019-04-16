import _ from 'lodash';
import React, {Component, Fragment} from 'react';
import {withLastLocation} from 'react-router-last-location';
import PropTypes from 'prop-types';
import {geocodeByAddress} from 'react-places-autocomplete';
import skyBlueArrowRight from '../../assets/images/a3-right-arrow.png';
import filterCloseIcon from '../../assets/images/icon-filter-close.png';
import filterIcon from '../../assets/images/filter-icon.png';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import VehicleListComponent from '../vehicle-list/VehicleListComponent';
import ZipCodeService from '../../services/api/ZipCodeService';
import './BrowseVehiclePage.scss';
import {Api, ContentfulService, DmaApi, segmentAnalytics} from '../../config/ApplicationContext';
import DmaApiService from '../../services/api/DmaApiService';
import MarkdownContent from '../content/MarkdownContent';
import LoadingIndicator from '../LoadingIndicator';
import OfflineIndicator from '../OfflineIndicator';
import VehicleColorFilterComponent from '../../components/VehicleColorFilterComponent';
import VehicleModelFilterComponent from '../../components/VehicleModelFilterComponent';
import VehiclePriceRangeFilterComponent from '../VehiclePriceRangeFilterComponent';
import * as VehiclesFilterConfigTypes from '../../constants/VehiclesFilterConfigTypes';

class BrowseVehiclePage extends Component {
  static getInitialVehicleModels(vehicleModels) {
    let models = [];
    if (vehicleModels) {
      models = vehicleModels.map((vehicleModel, index) => {
        return {
          index,
          label: vehicleModel.label,
          value: vehicleModel.value,
          checked: true
        };
      });
    }
    return models;
  }

  static getInitialVehicleColors(vehicleColors) {
    let colors = [];
    if (vehicleColors) {
      colors = vehicleColors.map((vehicleColor, index) => {
        return {
          index,
          name: vehicleColor.name,
          displayName: vehicleColor.displayName,
          backgroundHexCode: vehicleColor.backgroundHexCode,
          checkMarkColor: vehicleColor.checkMarkColor,
          checked: true
        };
      });
    }
    return colors;
  }

  static getMatchedVehiclesCount(vehicles) {
    return vehicles.filter(vehicle => vehicle.isFullyMatched).length;
  }

  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      nonServiceableUserContent: {},
      nonServiceableUserEmail: '',
      nonServiceableContentSubmitted: false,
      areaServiceable: false,
      loaded: false,
      isOffline: false,
      areas: [],
      defaultAreaId: '',
      showAreaContainer: false,
      location: '',
      initialAreaNonServiceable: false,
      vehicleModels: [],
      vehicleColors: [],
      partiallyFilteredVehicleModels: [],
      partiallyFilteredVehicleColors: [],
      maxBasePrice: '',
      partiallySelectedMaxBasePrice: '',
      maxRangeValue: '',
      minRangeValue: '',
      vehicleCount: 0,
      filteredVehicleCount: 0,
      isFilterModified: false,
      isApplyingFilters: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
    this.fetchAreaByZipCode = this.fetchAreaByZipCode.bind(this);
    this.fetchAreasByProgramId = this.fetchAreasByProgramId.bind(this);
    this.handleAreaChange = this.handleAreaChange.bind(this);
    this.fetchVehiclesByAreaId = this.fetchVehiclesByAreaId.bind(this);
    this.checkAreaServiceable = this.checkAreaServiceable.bind(this);
    this.showOtherAvailableAreas = this.showOtherAvailableAreas.bind(this);
    this.handleNonServiceableArea = this.handleNonServiceableArea.bind(this);
    this.checkLocation = this.checkLocation.bind(this);
    this.closeVehicleFilter = this.closeVehicleFilter.bind(this);
    this.getFilterConfig = this.getFilterConfig.bind(this);
    this.updateColorFilter = this.updateColorFilter.bind(this);
    this.updateModelFilter = this.updateModelFilter.bind(this);
    this.updateRangeFilter = this.updateRangeFilter.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.updateFilteredVehicleCount = this.updateFilteredVehicleCount.bind(this);
    this.closeVehicleFilter = this.closeVehicleFilter.bind(this);
    this.resetAllVehicleFilters = this.resetAllVehicleFilters.bind(this);
    this.fetchFilterOptions = this.fetchFilterOptions.bind(this);
    this.updatePartiallySelectedMaxBasePrice = this.updatePartiallySelectedMaxBasePrice.bind(this);
    this.cancelPartiallyAppliedFilters = this.cancelPartiallyAppliedFilters.bind(this);
    this.checkForModifiedFilters = this.checkForModifiedFilters.bind(this);
    this.handlePersistenceOfAppliedFilters = this.handlePersistenceOfAppliedFilters.bind(this);
  }

  componentDidMount() {
    ZipCodeService.onChange(() => {
      this.fetchAreaByZipCode();
    });
    this.fetchAreaByZipCode();
    this.getFilterConfig();
  }
  async getFilterConfig() {
    const filterConfig = await Api.get('/configuration');
    this.setState({
      displayFilters: filterConfig.vehiclesFilterConfig,
      filterThreshold: filterConfig.vehiclesFilterThreshold
    }, () => {
      if (!this.showFiltersMenu()) {
        sessionStorage.removeItem('applied_filters');
      }
    });
  }

  getPartiallyAppliedFilterValues() {
    let partiallyFilteredVehicleModels = [];
    let partiallyFilteredVehicleColors = [];
    if (this.state.partiallyFilteredVehicleModels) {
      partiallyFilteredVehicleModels = this.state.partiallyFilteredVehicleModels.filter(vehicleModel => vehicleModel.checked).map(vehicleModel => vehicleModel.value);
    }
    if (this.state.partiallyFilteredVehicleColors) {
      partiallyFilteredVehicleColors = this.state.partiallyFilteredVehicleColors.filter(vehicleColor => vehicleColor.checked).map(vehicleColor => vehicleColor.name);
    }
    return { partiallyFilteredVehicleModels, partiallyFilteredVehicleColors };
  }

  getAppliedFilterValues() {
    let vehicleColors = [];
    let vehicleModels = [];
    if (this.state.vehicleColors) {
      vehicleColors = this.state.vehicleColors.filter(vehicleColor => vehicleColor.checked).map(vehicleColor => vehicleColor.name);
    }

    if (this.state.vehicleModels) {
      vehicleModels = this.state.vehicleModels.filter(vehicleModel => vehicleModel.checked).map(vehicleModel => vehicleModel.value);
    }
    return { vehicleModels, vehicleColors };
  }

  getPartiallyAppliedFilters() {
    return {
      vehicleModels: this.state.partiallyFilteredVehicleModels,
      vehicleColors: this.state.partiallyFilteredVehicleColors,
      maxBasePrice: this.state.partiallySelectedMaxBasePrice,
    };
  }

  cancelPartiallyAppliedFilters() {
    this.setState({
      partiallyFilteredVehicleModels: _.cloneDeep(this.state.vehicleModels),
      partiallyFilteredVehicleColors: _.cloneDeep(this.state.vehicleColors),
      partiallySelectedMaxBasePrice: this.state.maxBasePrice,
      filteredVehicleCount: this.state.vehicleCount
    }, () => this.checkForModifiedFilters(this.getPartiallyAppliedFilters()));
  }

  checkAreaServiceable() {
    if (this.state.defaultAreaId) {
      DmaApi.get(`/areas/${this.state.defaultAreaId}`).then((response) => {
        const areaServiceableStatus = response.status.name === 'Serviceable';
        this.setState({
          areaServiceable: areaServiceableStatus,
        }, () => this.handleNonServiceableArea());
      });
    }
  }

  fetchAreasByProgramId() {
    const programId = DmaApiService.getCsaProgramId();
    DmaApi.get(`/programs/${programId}/areas`).then((response) => {
      const allAreas = response.content;
      if (this.state.initialAreaNonServiceable) {
        const newArea = {
          id: 'non-serviceable-area',
          areaName: 'Your Location'
        };
        allAreas.push(newArea);
      }
      this.setState({
        areas: allAreas,
      }, () => this.checkLocation());
    });
  }

  fetchVehiclesByAreaId(areaId) {
    if (areaId) {
      this.setState({
        isApplyingFilters: true
      });
      const filters = this.getAppliedFilterValues();
      Api.get(`/vehicles/areas/${areaId}?modelIds=${filters.vehicleModels}&colors=${filters.vehicleColors}&maxBasePrice=${this.state.maxBasePrice}`).then((response) => {
        this.setState({
          vehicles: response,
          vehicleCount: BrowseVehiclePage.getMatchedVehiclesCount(response),
          filteredVehicleCount: BrowseVehiclePage.getMatchedVehiclesCount(response),
          loaded: true,
          isApplyingFilters: false
        });
      }).catch((error) => {
        if (error.status === undefined) {
          this.setState({
            loaded: true,
            isOffline: true
          });
        }
      });
    }
  }

  fetchFilterOptions(defaultAreaId) {
    Api.get(`/vehicles/areas/${defaultAreaId}/filters`).then((response) => {
      const vehicleModels = BrowseVehiclePage.getInitialVehicleModels(response.models);
      const vehicleColors = BrowseVehiclePage.getInitialVehicleColors(response.colors);
      const partiallyFilteredVehicleModels = _.cloneDeep(vehicleModels);
      const partiallyFilteredVehicleColors = _.cloneDeep(vehicleColors);
      this.setState({
        partiallySelectedMaxBasePrice: response.maxBasePrice,
        maxBasePrice: response.maxBasePrice,
        maxRangeValue: response.maxBasePrice,
        minRangeValue: response.minBasePrice,
        vehicleModels,
        vehicleColors,
        partiallyFilteredVehicleModels,
        partiallyFilteredVehicleColors
      }, () => this.fetchVehiclesByAreaId(defaultAreaId));
    });
  }

  resetAllVehicleFilters() {
    sessionStorage.removeItem('applied_filters');
    sessionStorage.removeItem('isFilterApplied');
    segmentAnalytics.track('Filters reset', {category: 'filter_module'});
    this.setState({ isFilterModified: false }, () => this.fetchFilterOptions(this.state.defaultAreaId));
  }

  fetchAreaByZipCode() {
    const existingZipCode = ZipCodeService.extractZipCode();
    DmaApi.get(`/zips/${existingZipCode}/area`).then((response) => {
      const areaServiceableStatus = response.status.name === 'Serviceable';
      this.setState({
        defaultAreaId: response.id,
        areaServiceable: areaServiceableStatus,
      }, () => {
        this.fetchAreasByProgramId();
        this.handlePersistenceOfAppliedFilters();
        this.handleNonServiceableArea();
      });
    }).catch(() => {
      this.setState({
        initialAreaNonServiceable: true,
      }, () => this.fetchAreasByProgramId());
      ContentfulService.getEntry('1m5Ub6oUgEiekquoeiiUYO').then((resp) => {
        this.setState({
          nonServiceableUserContent: resp.fields,
          loaded: true
        });
      });
    });
  }

  showFiltersMenu() {
    if (VehiclesFilterConfigTypes.ALWAYS_SHOW === this.state.displayFilters) {
      return true;
    } else if (VehiclesFilterConfigTypes.NEVER_SHOW === this.state.displayFilters) {
      return false;
    } else if (VehiclesFilterConfigTypes.THRESHOLD_BASED === this.state.displayFilters) {
      return this.state.vehicleCount >= this.state.filterThreshold;
    }
    return false;
  }

  updatePartiallySelectedMaxBasePrice(partiallySelectedMaxBasePrice) {
    this.setState({ partiallySelectedMaxBasePrice });
  }

  handleNonServiceableArea() {
    if (!this.state.areaServiceable) {
      ContentfulService.getEntry('1m5Ub6oUgEiekquoeiiUYO').then((resp) => {
        this.setState({
          nonServiceableUserContent: resp.fields,
          loaded: true
        });
      });
    }
  }
  checkLocation() {
    if (this.state.areas && this.state.defaultAreaId) {
      const defaultArea = this.state.areas.find((area) => {
        return area.id === this.state.defaultAreaId;
      }).areaName;
      const defaultRegion = this.state.areas.find((area) => {
        return area.id === this.state.defaultAreaId;
      }).region.name;
      const address = `${defaultArea},${defaultRegion}`;
      geocodeByAddress(address).then((results) => {
        const selectedAddress = results[0].formatted_address;
        this.setState({
          location: selectedAddress.substring(0, selectedAddress.lastIndexOf(',')),
        });
      });
    }
  }
  handleEmailChange(e) {
    this.setState({
      nonServiceableUserEmail: e.target.value
    });
  }

  handleAreaChange(areaId) {
    if (areaId === 'non-serviceable-area') {
      this.setState({
        defaultAreaId: areaId,
        areaServiceable: false,
        showAreaContainer: false
      }, () => {
        this.resetAllVehicleFilters();
        this.handleNonServiceableArea();
      });
    } else {
      this.setState({
        defaultAreaId: areaId,
        showAreaContainer: false
      }, () => {
        this.checkLocation();
        this.resetAllVehicleFilters();
        this.checkAreaServiceable();
      });
    }
  }

  handlePersistenceOfAppliedFilters() {
    const { lastLocation } = this.props;
    const appliedFilters = sessionStorage.getItem('applied_filters');
    if ((appliedFilters !== null && lastLocation === null) || (appliedFilters !== null && lastLocation != null && lastLocation.pathname.includes('/details/'))) {
      const sessionFilterData = sessionStorage.getItem('applied_filters');
      const sessionFilterDataJson = JSON.parse(sessionFilterData);
      Api.get(`/vehicles/areas/${this.state.defaultAreaId}/filters`).then((options) => {
        this.setState({
          maxBasePrice: sessionFilterDataJson.maxBasePrice,
          maxRangeValue: options.maxBasePrice,
          minRangeValue: options.minBasePrice,
          partiallySelectedMaxBasePrice: sessionFilterDataJson.maxBasePrice,
          vehicleModels: _.cloneDeep(sessionFilterDataJson.vehicleModels),
          vehicleColors: _.cloneDeep(sessionFilterDataJson.vehicleColors),
          partiallyFilteredVehicleModels: _.cloneDeep(sessionFilterDataJson.vehicleModels),
          partiallyFilteredVehicleColors: _.cloneDeep(sessionFilterDataJson.vehicleColors)
        }, () => {
          this.fetchVehiclesByAreaId(this.state.defaultAreaId);
          this.checkForModifiedFilters(this.getPartiallyAppliedFilters());
        });
      });
    } else {
      sessionStorage.removeItem('applied_filters');
      sessionStorage.removeItem('isFilterApplied');
      this.fetchFilterOptions(this.state.defaultAreaId);
    }
  }

  submitEmail() {
    const interestedParty = {
      email: this.state.nonServiceableUserEmail,
      zipCode: ZipCodeService.extractZipCode(),
      isServiceable: this.state.areaServiceable
    };
    Api.post('/parties', interestedParty).then(() => {
      segmentAnalytics.track('Submit Email', {
        category: 'Interested Party',
        label: `${interestedParty.email} | ${interestedParty.zipCode} | ${interestedParty.isServiceable}`
      });
      this.setState({
        nonServiceableContentSubmitted: true
      });
    });
  }
  async showOtherAvailableAreas() {
    const showContainer = !this.state.showAreaContainer;
    this.setState({
      showAreaContainer: showContainer
    });
  }
  applyFilters() {
    const appliedFilters = {
      vehicleModels: _.cloneDeep(this.state.partiallyFilteredVehicleModels),
      vehicleColors: _.cloneDeep(this.state.partiallyFilteredVehicleColors),
      maxBasePrice: this.state.partiallySelectedMaxBasePrice,
    };
    this.checkForModifiedFilters(appliedFilters, true);
    sessionStorage.setItem('applied_filters', JSON.stringify(appliedFilters));
    this.setState({ showFilter: false });
    segmentAnalytics.track('Filters applied', {
      category: 'filter_module_apply',
      maxBasePrice: this.state.maxBasePrice,
      colors: (appliedFilters.vehicleColors || []).filter(color => color.checked).map(color => color.displayName).join(','),
      models: (appliedFilters.vehicleModels || []).filter(model => model.checked).map(model => model.label).join(',')
    });
    this.setState(
      {
        vehicleColors: appliedFilters.vehicleColors,
        vehicleModels: appliedFilters.vehicleModels,
        maxBasePrice: appliedFilters.maxBasePrice
      },
      () => this.fetchVehiclesByAreaId(this.state.defaultAreaId)
    );
  }

  checkForModifiedFilters(appliedFilters, isApplied) {
    const modelsCount = appliedFilters.vehicleModels.filter(model => !model.checked);
    const colorsCount = appliedFilters.vehicleColors.filter(model => !model.checked);
    if (modelsCount.length === 0 && colorsCount.length === 0 && appliedFilters.maxBasePrice === this.state.maxRangeValue) {
      this.setState({ isFilterModified: false });
      if (isApplied) {
        sessionStorage.removeItem('isFilterApplied');
      }
    } else {
      this.setState({ isFilterModified: true });
      if (isApplied) {
        sessionStorage.setItem('isFilterApplied', true);
      }
    }
  }

  updateColorFilter(index) {
    const { partiallyFilteredVehicleColors } = this.state;
    const color = partiallyFilteredVehicleColors[index];
    color.checked = !color.checked;
    segmentAnalytics.track(`Color ${color.checked ? 'Selected' : 'Deselected'}`, { category: 'filter_module_pre', label: color.displayName});
    this.setState({ partiallyFilteredVehicleColors }, () => this.checkForModifiedFilters(this.getPartiallyAppliedFilters()));
    this.updateFilteredVehicleCount();
  }

  updateModelFilter(index) {
    const { partiallyFilteredVehicleModels } = this.state;
    const model = partiallyFilteredVehicleModels[index];
    model.checked = !model.checked;
    segmentAnalytics.track(`Model ${model.checked ? 'Selected' : 'Deselected'}`, { category: 'filter_module_pre', label: model.label});
    this.setState({ partiallyFilteredVehicleModels }, () => this.checkForModifiedFilters(this.getPartiallyAppliedFilters()));
    this.updateFilteredVehicleCount();
  }

  updateRangeFilter(partiallySelectedMaxBasePrice) {
    segmentAnalytics.track('Price Updated', { category: 'filter_module_pre', label: partiallySelectedMaxBasePrice});
    this.setState({ partiallySelectedMaxBasePrice }, () => this.checkForModifiedFilters(this.getPartiallyAppliedFilters()));
    this.updateFilteredVehicleCount();
  }

  updateFilteredVehicleCount() {
    const filters = this.getPartiallyAppliedFilterValues();
    Api.get(`/vehicles/areas/${this.state.defaultAreaId}/count?modelIds=${filters.partiallyFilteredVehicleModels}&colors=${filters.partiallyFilteredVehicleColors}&maxBasePrice=${this.state.partiallySelectedMaxBasePrice}`).then((response) => {
      this.setState({
        filteredVehicleCount: response,
      });
    });
  }

  closeVehicleFilter() {
    this.cancelPartiallyAppliedFilters();
    segmentAnalytics.track('Filter closed', { category: 'filter_module_pre'});
    this.setState({ showFilter: false });
  }

  render() {
    const vehicleUnavailableMessage = (this.state.areaServiceable) ? (
      <span>
        Cars unavailable in <span role="presentation" onClick={this.showOtherAvailableAreas} onKeyDown={this.showOtherAvailableAreas}>{this.state.location.substring(0, this.state.location.indexOf(','))}</span>
      </span>
    ) : (
      <span role="presentation" onClick={this.showOtherAvailableAreas} onKeyDown={this.showOtherAvailableAreas}>Vehicles unavailable in your location</span>
    );
    const areaDetailsHtml = ((this.state.vehicleCount || this.state.isFilterModified) && this.state.location) ? (
      <span>
        Cars available in <span className="area-name" role="presentation" onClick={this.showOtherAvailableAreas} onKeyDown={this.showOtherAvailableAreas}>{this.state.location}</span>
      </span>
    ) : (
      <span>{vehicleUnavailableMessage}</span>
    );
    const areaDropDown = (
      <div className="area-dropdown-container" onMouseLeave={() => { this.setState({showAreaContainer: false}); }}>
        {this.state.showAreaContainer && this.state.areas.map((area) => {
          return (
            <div className="area-options" onClick={() => { this.handleAreaChange(area.id); }} onKeyDown={() => { this.handleAreaChange(area.id); }} role="presentation">
              <span>{area.areaName}</span>
            </div>
          );
        })}
      </div>
    );
    const filterComponents = (
      <Fragment>
        <VehiclePriceRangeFilterComponent updatePartiallySelectedMaxBasePrice={this.updatePartiallySelectedMaxBasePrice} minRangeValue={this.state.minRangeValue} maxRangeValue={this.state.maxRangeValue} partiallySelectedMaxBasePrice={this.state.partiallySelectedMaxBasePrice} updateRangeFilter={this.updateRangeFilter} />
        <VehicleModelFilterComponent partiallyFilteredVehicleModels={this.state.partiallyFilteredVehicleModels} updateModelFilter={this.updateModelFilter} />
        <VehicleColorFilterComponent partiallyFilteredVehicleColors={this.state.partiallyFilteredVehicleColors} updateColorFilter={this.updateColorFilter} />
        <div className="apply-filter-btn">
          <button className="csa-button primary" onClick={this.applyFilters}>Apply Filters</button>
        </div>
      </Fragment>
    );
    const filterModalContent = (
      <div className="filter-modal mobile-only">
        <div className="filter-header-wrapper">
          <div className="filter-header">
            <div className="close-filters">
              <span className="close-icon" role="presentation" onClick={this.closeVehicleFilter} onKeyDown={this.closeVehicleFilter}><img src={filterCloseIcon} alt="filter close" /></span>
              <span className="filtering-vehicles">Filtering Vehicles</span>
            </div>
            {this.state.isFilterModified ?
              <div className="reset-filters" role="presentation" onClick={this.resetAllVehicleFilters} onKeyDown={this.resetAllVehicleFilters}>
                Reset All
              </div> : <div />
            }
          </div>
          <div className={(this.state.vehicles.length || !this.state.areaServiceable) ? 'search-bar' : 'search-bar vehicle-unavailable'}>
            <div className="search-area">
              <div className="area-details-wrapper">
                <div className="area-details">
                  {areaDetailsHtml}
                  <span className="down-chevron" role="presentation" onClick={this.showOtherAvailableAreas} onKeyDown={this.showOtherAvailableAreas}><img className="arrow" src={skyBlueArrowRight} alt="arrow right" /></span>
                </div>
                <div className="number-of-results">
                  {this.state.areaServiceable ? this.state.filteredVehicleCount : 0 } results
                </div>
              </div>
              {areaDropDown}
            </div>
          </div>
        </div>
        {filterComponents}
      </div>
    );
    if (!this.state.loaded) {
      return (
        <HeaderAndFooterPage>
          <LoadingIndicator />
        </HeaderAndFooterPage>
      );
    } else if (this.state.isOffline) {
      return (
        <HeaderAndFooterPage>
          <OfflineIndicator />
        </HeaderAndFooterPage>
      );
    } else if (this.state.showFilter) {
      return (
        <Fragment>
          {filterModalContent}
        </Fragment>
      );
    }

    const outOfAreaPage = this.state.nonServiceableUserContent;
    let message = (
      <Fragment>
        <MarkdownContent markdown={outOfAreaPage.instructions} />
        <div className="action-field">
          <input className="block large" type="text" placeholder="Email Address" value={this.state.nonServiceableUserEmail} onChange={this.handleEmailChange} />
          <button onClick={this.submitEmail} className="csa-button accent">{outOfAreaPage.buttonText}</button>
        </div>
      </Fragment>
    );
    if (this.state.nonServiceableContentSubmitted) {
      message = <MarkdownContent markdown={outOfAreaPage.successfulSubmitMessage} />;
    }
    const filterIconLabel = (
      <Fragment>
        <img src={filterIcon} alt="filter vehicles" />
        <span className="filter-label">Filter Vehicles</span>
      </Fragment>
    );
    const filterIconResetAllSection = (
      this.showFiltersMenu() &&
        <Fragment>
          <div className="filter-icon-wrapper">
            <div className="filter-icon mobile-only" tabIndex="-1" role="button" onClick={() => this.setState({ showFilter: true})} onKeyDown={() => this.setState({ showFilter: true})}>
              {filterIconLabel}
            </div>
            <div className="filter-icon desktop-only">
              {filterIconLabel}
            </div>
            {this.state.isFilterModified ?
              <div className="reset-filters browse-reset" role="presentation" onClick={this.resetAllVehicleFilters} onKeyDown={this.resetAllVehicleFilters}>
                Reset All
              </div> : null
            }
          </div>
        </Fragment>
    );
    const desktopFilterSection = (
      <div className="desktop-filters desktop-only">
        {filterIconResetAllSection}
        <div className="line-gradient select-line desktop-only" />
        <div className="filter-components">
          <div className="number-of-results">
            {this.state.filteredVehicleCount} results
          </div>
          {filterComponents}
        </div>
      </div>
    );
    const pageContent = (this.state.areaServiceable) ? (
      <Fragment>
        <div className={this.state.isApplyingFilters ? 'vehicles-filter-wrapper disabled-input' : 'vehicles-filter-wrapper'}>
          <div className={this.showFiltersMenu() === true ? 'mobile-gradient-wrapper mobile-only' : 'mobile-gradient-wrapper mobile-only bottom-align'}>
            {filterIconResetAllSection}
            <div className="line-gradient select-line" />
          </div>
          <VehicleListComponent vehicles={this.state.vehicles} onResetVehicleFilters={() => this.resetAllVehicleFilters()} />
          {desktopFilterSection}
        </div>
      </Fragment>) : (
        <div className="out-of-area messaging-page">
          <div className="header-info">
            <h1>{outOfAreaPage.header}</h1>
          </div>
          <div className="messaging-content">
            {message}
          </div>
        </div>);
    return (
      <HeaderAndFooterPage classNameContentAlignment="full-stretch">
        <Fragment>
          <div className={(this.state.vehicleCount || !this.state.areaServiceable) ? 'search-bar browse-vehicle-mobile' : 'search-bar vehicle-unavailable browse-vehicle-mobile'}>
            <div className="search-area">
              <div className="area-details-wrapper">
                <div className="area-details">
                  {areaDetailsHtml}
                  <span className="down-chevron" role="presentation" onClick={this.showOtherAvailableAreas} onKeyDown={this.showOtherAvailableAreas}><img className="arrow" src={skyBlueArrowRight} alt="arrow right" /></span>
                </div>
                <div className="number-of-results mobile-only">{this.state.areaServiceable ? this.state.vehicleCount : 0 } results</div>
              </div>
              {areaDropDown}
            </div>
          </div>
          {pageContent}
        </Fragment>
      </HeaderAndFooterPage>
    );
  }
}

BrowseVehiclePage.propTypes = {
  lastLocation: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired
};

export default withLastLocation(BrowseVehiclePage);
