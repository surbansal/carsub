import React from 'react';
import PropTypes from 'prop-types';
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle} from 'react-accessible-accordion';
import {Elements, StripeProvider} from 'react-stripe-elements';
import {Element, scroller} from 'react-scroll';
import {withRouter} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import './Accordion.scss';
import './VehicleSubscriptionWrapperComponent.scss';
import VehicleSubscriptionOptionsComponent from './VehicleSubscriptionOptionsComponent';
import VehiclePersonalInformationComponent from './VehiclePersonalInformationComponent';
import VehicleDeliveryOptionsComponent from './VehicleDeliveryOptionsComponent';
import infoIconImage from '../../assets/images/info-icon.png';
import PaymentInfoComponent from './PaymentInfoComponent';
import PriceBreakdown from './PriceBreakdown';
import VehicleSubscriptionWrapperBaseComponent from './VehicleSubscriptionWrapperBaseComponent';
import ZipCodeService from '../../services/api/ZipCodeService';

class VehicleSubscriptionWrapperComponentDesktop extends VehicleSubscriptionWrapperBaseComponent {
  static handleCheckoutStepScroll(currentStep) {
    if (currentStep === 2) {
      scroller.scrollTo('vehicle-detail-subscribe', {
        offset: -30,
      });
    } else if (currentStep === 3) {
      scroller.scrollTo('delivery-option-container', {
        duration: 800,
        delay: 0,
        offset: -10,
        smooth: 'easeInOutQuart'
      });
    } else if (currentStep === 4) {
      scroller.scrollTo('payment-info-container', {
        duration: 800,
        delay: 0,
        offset: -10,
        smooth: 'easeInOutQuart'
      });
    }
  }

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
      mileagePackage: null,
      currentStep: 1,
      zip: ZipCodeService.extractZipCode(),
      isStepSaving: false,
      stripePublicKey: null,
      subscriptionFailureResponse: null,
      displayDeliveryDayOptions: false,
    };
    this.handleAccordionOnChange = this.handleAccordionOnChange.bind(this);
  }
  componentDidMount() {
    this.getStripeKey();
  }
  handleSubscriptionOptionsComplete(args) {
    this.accordion.accordionStore.state.items[0].expanded = false;
    this.accordion.accordionStore.state.items[1].expanded = true;
    this.setState({
      subscriptionOptions: args.subscriptionOptions,
      subscriptionOptionsCompleted: true,
      currentStep: 2
    }, () => VehicleSubscriptionWrapperComponentDesktop.handleCheckoutStepScroll(this.state.currentStep));
  }
  handlePersonalInformationComplete(args) {
    this.accordion.accordionStore.state.items[1].expanded = false;
    this.accordion.accordionStore.state.items[2].expanded = true;

    this.setState({
      displayDeliveryDayOptions: true,
      personalInformation: args.personalInformation,
      personalInformationCompleted: true,
      zip: args.personalInformation.homeAddress.zipCode,
      currentStep: 3
    }, () => VehicleSubscriptionWrapperComponentDesktop.handleCheckoutStepScroll(this.state.currentStep));
  }
  handleDeliveryOptionComplete(args) {
    const subscriptionTime = new Date().getHours();
    if (subscriptionTime < 15) {
      this.setState({ deliveryTimeBeforeThree: true });
    }
    this.accordion.accordionStore.state.items[2].expanded = false;
    this.accordion.accordionStore.state.items[3].expanded = true;

    this.setState({
      deliveryOptions: args.deliveryOptions,
      deliveryOptionsCompleted: true,
      currentStep: 4
    }, () => VehicleSubscriptionWrapperComponentDesktop.handleCheckoutStepScroll(this.state.currentStep));
  }
  handlePaymentInfoComplete(args) {
    this.setState({
      paymentInformation: args.billingDetails,
      paymentInfoCompleted: true,
      currentStep: 5
    }, () => this.completeSubscriptionRequest());
  }

  handleAccordionOnChange(uuid) {
    const pressedAccordionStepNumber = parseInt(uuid, 10);
    // Prevent changing accordion if current step is saving.
    if (this.state.isStepSaving === true) {
      this.accordion.accordionStore.state.items[this.state.currentStep - 1].expanded = true;
      this.accordion.accordionStore.state.items[pressedAccordionStepNumber - 1].expanded = false;
      this.setState(this.state);
      return;
    }

    // Prevent collapsing current accordion
    if (pressedAccordionStepNumber === this.state.currentStep) {
      this.accordion.accordionStore.state.items[pressedAccordionStepNumber - 1].expanded = true;
      this.setState(this.state);
      return;
    } else if (pressedAccordionStepNumber > this.state.currentStep) {
      this.accordion.accordionStore.state.items[pressedAccordionStepNumber - 1].expanded = false;
      this.accordion.accordionStore.state.items[this.state.currentStep - 1].expanded = true;
      this.setState(this.state);
      return;
    }
    this.setState({
      currentStep: pressedAccordionStepNumber
    });
  }
  render() {
    if (!this.state.vehicle || !this.state.stripePublicKey) {
      return null;
    }

    const completedStepDisplay = <div className="step-number completed">&#10004;</div>;

    const subscriptionOptionsStepDisplay = this.state.subscriptionOptionsCompleted ? (
      completedStepDisplay
    ) : (
      <div className="step-number">1</div>
    );

    const personalInformationStepDisplay = this.state.personalInformationCompleted ? (
      completedStepDisplay
    ) : (
      <div className="step-number">2</div>
    );

    const deliveryOptionsStepDisplay = this.state.deliveryOptionsCompleted ? (
      completedStepDisplay
    ) : (
      <div className="step-number">3</div>
    );

    const paymentInfoStepDisplay = this.state.paymentInfoCompleted ? (
      completedStepDisplay
    ) : (
      <div className="step-number">4</div>
    );

    const headerInfoDisplay = this.state.subscriptionOptionsCompleted ? (
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
    ) : (
      <h2>Let&#39;s get started!</h2>
    );

    return (
      <Element name="vehicle-detail-subscribe" id="vehicle-detail-subscribe" className="vehicle-detail-subscribe">
        <div className="line-gradient" />
        {headerInfoDisplay}
        <div className="subscribe-steps">
          <Accordion
            ref={(accordion) => { this.accordion = accordion; }}
            onChange={this.handleAccordionOnChange}
          >
            <AccordionItem expanded="true" uuid="1">
              <AccordionItemTitle className={this.state.subscriptionOptionsCompleted && this.state.currentStep !== 1 ? 'accordion__title' : 'accordion__title not-expandable'}>
                {subscriptionOptionsStepDisplay}
                <h3 className="medium">Choose Options</h3>
              </AccordionItemTitle>
              <AccordionItemBody>
                <VehicleSubscriptionOptionsComponent
                  subscriptionOptions={this.props.subscriptionOptions}
                  vehicle={this.state.vehicle}
                  leadsData={this.state.leadsData}
                  homeAddress={this.state.personalInformation.homeAddress}
                  onComplete={this.handleSubscriptionOptionsComplete}
                  onMileagePackageUpdate={this.handleMileagePackageUpdate}
                />
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem uuid="2">
              <AccordionItemTitle className={this.state.personalInformationCompleted && this.state.currentStep > 2 ? 'accordion__title' : 'accordion__title not-expandable'}>
                {personalInformationStepDisplay}
                <h3 className="medium">Personal Information</h3>
              </AccordionItemTitle>
              <AccordionItemBody className={this.state.personalInformationStepSaving ? 'accordion__body disabled-input' : 'accordion__body'}>
                <VehiclePersonalInformationComponent
                  vehicle={this.state.vehicle}
                  leadsData={this.state.leadsData}
                  onComplete={this.handlePersonalInformationComplete}
                  onSaving={this.handleOnPersonalInformationStepSaving}
                />
              </AccordionItemBody>
            </AccordionItem>
            <AccordionItem uuid="3">
              <AccordionItemTitle className={this.state.deliveryOptionsCompleted && this.state.currentStep > 3 ? 'accordion__title' : 'accordion__title not-expandable'}>
                {deliveryOptionsStepDisplay}
                <span className="delivery-options-label">
                  <h3 className="medium">Preferred Delivery Options</h3>
                  <div>
                    &nbsp;&nbsp;<img data-tip="We’ll confirm your delivery window once you've completed the process." data-for="del-opt-tooltip" className="info" src={infoIconImage} alt="More Information" />
                    <ReactTooltip id="del-opt-tooltip" />
                  </div>
                </span>
              </AccordionItemTitle>
              <Element name="delivery-option-container">
                <AccordionItemBody className={this.state.deliveryOptionsStepSaving ? 'accordion__body disabled-input' : 'accordion__body'}>
                  <VehicleDeliveryOptionsComponent
                    subscriptionOptions={this.props.subscriptionOptions}
                    displayDeliveryDayOptions={this.state.displayDeliveryDayOptions}
                    vehicle={this.state.vehicle}
                    leadsData={this.state.leadsData}
                    homeAddress={this.state.personalInformation.homeAddress}
                    onComplete={this.handleDeliveryOptionComplete}
                    onSaving={this.handleOnDeliveryOptionsStepSaving}
                  />
                </AccordionItemBody>
              </Element>
            </AccordionItem>
            <AccordionItem uuid="4" className="accordion__item last">
              <AccordionItemTitle className={this.state.paymentInfoCompleted && this.state.currentStep > 4 ? 'accordion__title' : 'accordion__title not-expandable'}>
                {paymentInfoStepDisplay}
                <h3 className="medium">Payment Information</h3>
              </AccordionItemTitle>
              <Element name="payment-info-container">
                <AccordionItemBody className={this.state.paymentInformationStepSaving ? 'accordion__body disabled-input' : 'accordion__body'}>
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
                </AccordionItemBody>
              </Element>
            </AccordionItem>
          </Accordion>
        </div>
      </Element>
    );
  }
}

VehicleDeliveryOptionsComponent.propTypes = {
  subscriptionOptions: PropTypes.shape({}).isRequired
};

export default withRouter(VehicleSubscriptionWrapperComponentDesktop);
