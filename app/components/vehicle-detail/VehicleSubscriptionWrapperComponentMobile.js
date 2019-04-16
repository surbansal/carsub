import React from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import ReactTooltip from 'react-tooltip';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Accordion.scss';
import './VehicleSubscriptionWrapperComponent.scss';
import VehicleSubscriptionOptionsComponent from './VehicleSubscriptionOptionsComponent';
import VehiclePersonalInformationComponent from './VehiclePersonalInformationComponent';
import VehicleDeliveryOptionsComponent from './VehicleDeliveryOptionsComponent';
import infoIconImage from '../../assets/images/info-icon.png';
import PaymentInfoComponent from './PaymentInfoComponent';
import PriceBreakdown from './PriceBreakdown';
import ZipCodeService from '../../services/api/ZipCodeService';
import VehicleSubscriptionWrapperBaseComponent from './VehicleSubscriptionWrapperBaseComponent';

class VehicleSubscriptionWrapperComponentMobile extends VehicleSubscriptionWrapperBaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: props.vehicle,
      leadsData: props.leadsData,
      subscriptionOptionsCompleted: false,
      personalInformationStepSaving: false,
      personalInformationCompleted: false,
      deliveryOptionsStepSaving: false,
      deliveryOptionsCompleted: false,
      paymentInfoStepSaving: false,
      paymentInfoCompleted: false,
      paymentInformation: {},
      subscriptionOptions: {},
      personalInformation: {},
      deliveryOptions: {},
      currentStep: 1,
      zip: ZipCodeService.extractZipCode(),
      isStepSaving: false,
      stripePublicKey: null,
      subscriptionFailureResponse: null,
      mileagePackage: null,
      subscriptionSteps: {
        1: 'Details',
        2: 'Choose Options',
        3: 'Personal Information',
        4: 'Delivery Options',
      },
      displayDeliveryDayOptions: false,
      deliveryTimeBeforeThree: false,
    };
    this.stepMove = this.stepMove.bind(this);
  }

  componentDidMount() {
    this.getStripeKey();
  }

  handleSubscriptionOptionsComplete(args) {
    this.setState({
      subscriptionOptions: args.subscriptionOptions,
      subscriptionOptionsCompleted: true,
      currentStep: 2
    }, () => window.scrollTo(0, 0));
  }
  handlePersonalInformationComplete(args) {
    this.setState({
      displayDeliveryDayOptions: true,
      personalInformation: args.personalInformation,
      personalInformationCompleted: true,
      zip: args.personalInformation.homeAddress.zipCode,
      currentStep: 3
    }, () => window.scrollTo(0, 0));
  }
  handleDeliveryOptionComplete(args) {
    const subscriptionTime = new Date().getHours();
    if (subscriptionTime < 15) {
      this.setState({ deliveryTimeBeforeThree: true });
    }
    this.setState({
      deliveryOptions: args.deliveryOptions,
      deliveryOptionsCompleted: true,
      currentStep: 4
    }, () => window.scrollTo(0, 0));
  }
  handlePaymentInfoComplete(args) {
    this.setState({
      paymentInformation: args.billingDetails,
      paymentInfoCompleted: true,
    }, () => this.completeSubscriptionRequest());
  }
  stepMove() {
    const currentStepTemp = this.state.currentStep - 1;
    this.setState({currentStep: (currentStepTemp >= 1 ? currentStepTemp : 1) });
    if (currentStepTemp === 0) {
      this.props.carDetailsLinkClick(false);
    }
  }
  render() {
    if (!this.state.vehicle || !this.state.stripePublicKey) {
      return null;
    }

    const completedStepDisplay = <div className="step-number completed">&#10004;</div>;

    const subscriptionOptionsStepDisplay = this.state.subscriptionOptionsCompleted ? (
      completedStepDisplay
    ) : (
      <div className={this.state.currentStep === 1 ? 'step-number' : 'step-number not-completed'}>1</div>
    );

    const personalInformationStepDisplay = this.state.personalInformationCompleted ? (
      completedStepDisplay
    ) : (
      <div className={this.state.currentStep === 2 ? 'step-number' : 'step-number not-completed'}>2</div>
    );

    const deliveryOptionsStepDisplay = this.state.deliveryOptionsCompleted ? (
      completedStepDisplay
    ) : (
      <div className={this.state.currentStep === 3 ? 'step-number' : 'step-number not-completed'}>3</div>
    );

    const paymentInfoStepDisplay = this.state.paymentInfoCompleted ? (
      completedStepDisplay
    ) : (
      <div className={this.state.currentStep === 4 ? 'step-number' : 'step-number not-completed'}>4</div>
    );

    const headerInfoDisplay =
        (
          <div className="mobile-header">
            <h1 className="mobile-car-model-year">{this.state.vehicle.configuration.model.year} {this.state.vehicle.configuration.model.name}</h1>
            <div className="header-container">
              <div className="header-label">Your Subscription</div>
              <div className="header-cost">
                <div className="header-total-cost">
                  <PriceBreakdown vehicle={this.state.vehicle} mileagePackage={this.state.mileagePackage} zipCode={this.state.zip} totalOnly />
                </div>
                <div className="header-tooltip">
                  <img data-tip="Your monthly payment is based on the car you choose, your mileage plan and taxes according to where you live." data-for="veh-sub-wrap-tooltip" className="info" src={infoIconImage} alt="Total Cost" />
                </div>
              </div>
              <ReactTooltip id="veh-sub-wrap-tooltip" />
            </div>
            <hr />
          </div>);

    return (
      <div id="vehicle-detail-subscribe" className="vehicle-detail-subscribe">
        <div className="mobile-navigation">
          <span
            onClick={this.stepMove}
            role="button"
            tabIndex="-1"
            onKeyUp={this.stepMove}
          >
            &lt; {this.state.subscriptionSteps[this.state.currentStep]}
          </span>
        </div>
        {headerInfoDisplay}
        <div className="subscribe-steps">
          <div className="mobile-steps-no">
            {subscriptionOptionsStepDisplay} {personalInformationStepDisplay} {deliveryOptionsStepDisplay} {paymentInfoStepDisplay}
          </div>
          <div className={this.state.currentStep !== 1 ? 'hide' : ''}>
            <VehicleSubscriptionOptionsComponent
              vehicle={this.state.vehicle}
              subscriptionOptions={this.props.subscriptionOptions}
              leadsData={this.state.leadsData}
              homeAddress={this.state.personalInformation.homeAddress}
              onComplete={this.handleSubscriptionOptionsComplete}
              onMileagePackageUpdate={this.handleMileagePackageUpdate}
            />
          </div>
          <div className={this.state.currentStep !== 2 ? 'hide' : ''}>
            <div className={this.state.personalInformationStepSaving ? 'disabled-input' : ''}>
              <VehiclePersonalInformationComponent
                vehicle={this.state.vehicle}
                leadsData={this.state.leadsData}
                onComplete={this.handlePersonalInformationComplete}
                onSaving={this.handleOnPersonalInformationStepSaving}
              />
            </div>
          </div>
          <div className={this.state.currentStep !== 3 ? 'hide' : ''}>
            <div className={this.state.deliveryOptionsStepSaving ? 'disabled-input' : ''}>
              <VehicleDeliveryOptionsComponent
                subscriptionOptions={this.props.subscriptionOptions}
                displayDeliveryDayOptions={this.state.displayDeliveryDayOptions}
                vehicle={this.state.vehicle}
                leadsData={this.state.leadsData}
                homeAddress={this.state.personalInformation.homeAddress}
                onComplete={this.handleDeliveryOptionComplete}
                onSaving={this.handleOnDeliveryOptionsStepSaving}
              />
            </div>
          </div>
          <div className={this.state.currentStep !== 4 ? 'hide' : ''}>
            <div className={this.state.paymentInformationStepSaving ? 'disabled-input' : ''}>
              <StripeProvider apiKey={this.state.stripePublicKey}>
                <Elements>
                  <PaymentInfoComponent
                    vehicle={this.state.vehicle}
                    leadsData={this.state.leadsData}
                    mileagePackage={this.state.subscriptionOptions.mileagePackage}
                    homeAddress={this.state.personalInformation.homeAddress}
                    onComplete={this.handlePaymentInfoComplete}
                    onSaving={this.handleOnPaymentInformationStepSaving}
                    subscriptionFailureResponse={this.state.subscriptionFailureResponse}
                  />
                </Elements>
              </StripeProvider>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
VehicleSubscriptionWrapperComponentMobile.propTypes = {
  carDetailsLinkClick: PropTypes.func.isRequired,
  subscriptionOptions: PropTypes.shape({}).isRequired
};

export default withRouter(VehicleSubscriptionWrapperComponentMobile);
