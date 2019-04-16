import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import ReactTooltip from 'react-tooltip';
import './VehicleSubscriptionOptionsComponent.scss';
import infoIconImage from '../../assets/images/info-icon.png';
import VehicleType from '../../types/VehicleType';
import AddressType from '../../types/AddressType';
import {Api, logService} from '../../config/ApplicationContext';
import PriceBreakdown from './PriceBreakdown';
import ThirdPartyAnalytics from '../../services/ThirdPartyAnalytics';
import * as SeverityType from '../../constants/SeverityType';

class VehicleSubscriptionOptionsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: props.vehicle,
      mileagePackage: null,
      mileageValue: 0,
      mileageUnit: '',
      subscriptionLength: null,
      subscriptionLengthValue: 0,
      subscriptionLengthUnit: '',
      otherSubscriptionLengthClass: 'other-subscription hidden',
      errors: {
        subscriptionLength: false,
        subscriptionLengthMessage: '',
        mileagePackage: false,
        mileagePackageMessage: '',
      },
      homeAddress: {},
      isPriceBreakDownVisible: false
    };
    this.handleMileageValueChange = this.handleMileageValueChange.bind(this);
    this.handleSubscriptionDurationChange = this.handleSubscriptionDurationChange.bind(this);
    this.handleOnComplete = this.handleOnComplete.bind(this);
    this.handleOtherSubscriptionLengthChange = this.handleOtherSubscriptionLengthChange.bind(this);
    this.getPrice = this.getPrice.bind(this);
  }

  componentDidMount() {
    this.selectMileagePackage(this.props.subscriptionOptions.mileagePackages[0]);
    this.selectTermLength(this.props.subscriptionOptions.termLengths[0]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      homeAddress: nextProps.homeAddress || {}
    });
  }
  getPrice(mileagePackage) {
    const selectedPrice = this.state.vehicle.prices.find((price) => {
      if (price.mileagePackage && mileagePackage) {
        return price.mileagePackage.id === mileagePackage.id;
      }
      return price.mileagePackage === mileagePackage;
    });
    const mileagePackageCost = selectedPrice.mileagePackagePrice;
    return mileagePackageCost > 0 ? `(+ $${mileagePackageCost}/mo)` : '';
  }
  handleSubscriptionDurationChange(event, isMobile) {
    let durationId;
    if (isMobile) {
      durationId = event.target.id;
    } else {
      durationId = event.target.value;
    }
    const termLength = this.props.subscriptionOptions.termLengths.find((term) => {
      return `${term.id}` === durationId;
    });
    this.selectTermLength(termLength);
    const errorsTemp = this.state.errors;
    errorsTemp.subscriptionLength = false;
    errorsTemp.subscriptionLengthMessage = '';
    this.setState({
      errors: errorsTemp,
      isPriceBreakDownVisible: true
    });
  }
  selectTermLength(termLength) {
    if (termLength.unit === 'CUSTOM') {
      this.setState({
        subscriptionLength: termLength,
        subscriptionLengthUnit: 'MONTHS',
        otherSubscriptionLengthClass: 'other-subscription show'
      });
    } else {
      this.setState({
        subscriptionLength: termLength,
        subscriptionLengthValue: termLength.value,
        subscriptionLengthUnit: termLength.unit,
        otherSubscriptionLengthClass: 'other-subscription hidden'
      });
    }
  }

  handleOtherSubscriptionLengthChange(e) {
    this.setState({
      subscriptionLengthValue: parseInt(e.target.value, 10)
    });
    const errorsTemp = this.state.errors;
    errorsTemp.subscriptionLength = false;
    errorsTemp.subscriptionLengthMessage = '';
    this.setState({
      errors: errorsTemp
    });
  }

  handleMileageValueChange(event, isMobile) {
    let mileagePackageId;
    if (isMobile) {
      mileagePackageId = event.target.id;
    } else {
      mileagePackageId = event.target.value;
    }
    const selectedMileagePackage = this.props.subscriptionOptions.mileagePackages.find((mileagePackage) => {
      return `${mileagePackage.id}` === mileagePackageId;
    });
    this.selectMileagePackage(selectedMileagePackage);
    const errorsTemp = this.state.errors;
    errorsTemp.mileagePackage = false;
    errorsTemp.mileagePackageMessage = '';
    this.setState({
      errors: errorsTemp,
      isPriceBreakDownVisible: true
    });
  }
  selectMileagePackage(selectedMileagePackage) {
    this.setState({
      mileagePackage: selectedMileagePackage,
      mileageValue: selectedMileagePackage.value,
      mileageUnit: selectedMileagePackage.unit
    });
    this.props.onMileagePackageUpdate(selectedMileagePackage);
  }

  handleOnComplete() {
    const termLength = this.state.subscriptionLength;
    termLength.value = this.state.subscriptionLengthValue;
    this.setState({subscriptionLength: termLength}, () => this.subscriptionLead());
  }

  subscriptionLead() {
    Api.post(`/subscription/leads/${this.props.leadsData.publicId}/subscription-options`, {
      mileagePackage: this.state.mileagePackage,
      mileageValue: this.state.mileageValue,
      mileageUnit: this.state.mileageUnit,
      subscriptionLength: this.state.subscriptionLength,
      subscriptionLengthValue: this.state.subscriptionLengthValue,
      subscriptionLengthUnit: this.state.subscriptionLengthUnit,
      monthlyBase: this.state.monthlyBase,
      tax: this.state.tax,
      total: this.state.total
    }).then((response) => {
      this.clearValidations();
      ThirdPartyAnalytics.event({
        category: 'Submit Options',
        action: 'Car Subscription Options are Set'
      });
      this.props.onComplete({
        subscriptionOptions: {
          id: response.id,
          mileagePackage: this.state.mileagePackage,
          mileageValue: this.state.mileageValue,
          mileageUnit: this.state.mileageUnit,
          subscriptionLength: this.state.subscriptionLength,
          subscriptionLengthValue: this.state.subscriptionLengthValue,
          subscriptionLengthUnit: this.state.subscriptionLengthUnit,
          monthlyBase: this.state.monthlyBase,
          tax: this.state.tax,
          total: this.state.total
        }
      });
    }).catch((response) => {
      response.json().then((data) => {
        let logMessage;
        let logSeverity;
        let logCategory;
        if (data.validationErrors) {
          logSeverity = SeverityType.WARN;
          logCategory = 'Validation Error';
          data.validationErrors.map((field) => {
            const errorsTemp = this.state.errors;
            errorsTemp[field.property] = true;
            const errorMessage = `${field.property}Message`;
            errorsTemp[errorMessage] = field.message;
            logMessage = (logMessage) ? `${logMessage}${field.property} - ${field.message} \n ` : `${field.property} - ${field.message} \n `;
            this.setState({
              errors: errorsTemp
            });
            return null;
          });
        } else {
          // This is 500 server error scenario
          logSeverity = SeverityType.ERROR;
          logMessage = data.message;
          logCategory = 'System Error';
        }
        logService.logErrors(logMessage, logSeverity, logCategory, null, this.props.leadsData.publicId);
      });
    });
  }
  clearValidations() {
    this.setState({
      errors: {
        subscriptionLength: false,
        subscriptionLengthMessage: '',
        mileagePackage: false,
        mileagePackageMessage: '',
      }
    });
  }
  render() {
    if (!this.state.vehicle || !this.state.subscriptionLength || !this.state.mileagePackage) {
      return null;
    }
    const settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 3.8,
      slidesToScroll: 3
    };
    const settingsMileage = {
      infinite: false,
      speed: 500,
      slidesToShow: 2.6,
      slidesToScroll: 2
    };
    const optionsMobile = this.props.subscriptionOptions.termLengths.map((termLength) => {
      const isCurrent = `${this.state.subscriptionLength.id}` === `${termLength.id}`;
      return (
        <input
          className={`subscribe-length-duration-slider ${isCurrent ? 'selected' : ''}`}
          key={termLength.id}
          id={termLength.id}
          value={ termLength.displayName }
          onClick={(e) => { this.handleSubscriptionDurationChange(e, true); }}
          readOnly
        />
      );
    }).concat((
      <div key="pad-slider-for-right-scroll" />
    ));
    const optionsMileageMobile = this.props.subscriptionOptions.mileagePackages.map((mileagePackage) => {
      const isCurrent = `${this.state.mileagePackage.id}` === `${mileagePackage.id}`;
      const packageDisplayName = `${mileagePackage.unit}` === 'UNLIMITED_MILES' ? `${`${mileagePackage.displayName}`.split(' ')[0]}` : `${`${mileagePackage.displayName}`.split(' ')[0]} mi. / month`;
      return (
        <input
          key={mileagePackage.id}
          id={mileagePackage.id}
          className={ isCurrent ? 'subscribe-mileage-info-slider selected' : 'subscribe-mileage-info-slider'}
          value={packageDisplayName}
          onClick={(e) => { this.handleMileageValueChange(e, true); }}
          readOnly
        />
      );
    });
    return (
      <div className="subscribe-step">
        <h2 className="subscribe-step-heading hide medium">
            Choose Options
        </h2>
        <div className="subscribe-step-details">
          <label htmlFor="duration" className="subscribe-step-label">Subscription Length
            <img data-tip="Choose a term convenient for you and your needs — anywhere from 3 to 12 months." data-for="sub-op-tooltip" className="info" src={infoIconImage} alt="More Information" />
            <span className="sub-text">How long do you want to keep the car?</span>
          </label>
          <select
            className="subscribe-length-duration"
            id="duration"
            value={this.state.subscriptionLength.id}
            onChange={(e) => { this.handleSubscriptionDurationChange(e, false); }}
          >
            {this.props.subscriptionOptions.termLengths.map((termLength) => {
              return <option value={termLength.id} key={termLength.id}>{termLength.displayName}</option>;
            })}
          </select>
          <div className="subscribe-length-duration-mobile hide">
            <Slider { ...settings }>
              { optionsMobile }
            </Slider>
          </div>
          <div className="subscribe-term-inline">
            <div className="subscribe-term-detail-1">
              <input
                type="number"
                min="1"
                max="12"
                step="1"
                className={this.state.otherSubscriptionLengthClass}
                value={this.state.subscriptionLengthValue}
                onChange={(e) => { this.handleOtherSubscriptionLengthChange(e, false); }}
              />
            </div>

            <div className="subscribe-term-detail-2">
              <h3 className={this.state.otherSubscriptionLengthClass}>months</h3>
            </div>
          </div>
          <p className={ this.state.errors.subscriptionLength ? 'error-message' : 'hide-error'}>{ this.state.errors.subscriptionLengthMessage }</p>
        </div>
        <div className="subscribe-step-details">
          <label htmlFor="mileage" className="subscribe-step-label">Mileage Package
            <img data-multiline="true" data-tip="Unused mileage rolls over into the next month. Read the FAQ for more." data-for="sub-op-tooltip" className="info" src={infoIconImage} alt="More Information" />
            <span className="sub-text">How many miles do you want to drive?</span>
          </label>
          <select
            className="subscribe-mileage-info"
            id="mileage"
            value={this.state.mileagePackage.id}
            onChange={this.handleMileageValueChange}
          >
            {this.props.subscriptionOptions.mileagePackages.map((mileagePackage) => {
              return <option value={mileagePackage.id} key={mileagePackage.id}>{mileagePackage.displayName} &nbsp;{this.getPrice(mileagePackage)}</option>;
            })}
          </select>
          <div className="subscribe-length-duration-mobile hide">
            <Slider { ...settingsMileage }>
              { optionsMileageMobile }
            </Slider>
          </div>
          <p className={ this.state.errors.mileagePackage ? 'error-message' : 'hide-error'}>{ this.state.errors.mileagePackageMessage }</p>
        </div>
        <div className="subscribe-step-details">
          {this.state.isPriceBreakDownVisible && <PriceBreakdown vehicle={this.state.vehicle} mileagePackage={this.state.mileagePackage} zipCode={this.state.homeAddress.zipCode} />}
          <div className="submit-options">
            <button className="csa-button primary" onClick={this.handleOnComplete}>Submit Options</button>
          </div>
          <div className="fine-print">
            <p>You will not be charged until the final step</p>
            <p>*Tax estimated by zipcode. Final tax will be based on your home address</p>
          </div>
        </div>
        <ReactTooltip id="sub-op-tooltip" />
      </div>
    );
  }
}

VehicleSubscriptionOptionsComponent.propTypes = {
  vehicle: VehicleType.isRequired,
  leadsData: PropTypes.shape({
    publicId: PropTypes.string.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onMileagePackageUpdate: PropTypes.func.isRequired,
  homeAddress: AddressType,
  subscriptionOptions: PropTypes.shape({
    termLengths: PropTypes.arrayOf(PropTypes.shape),
    mileagePackages: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
};

VehicleSubscriptionOptionsComponent.defaultProps = {
  homeAddress: null
};

export default VehicleSubscriptionOptionsComponent;
