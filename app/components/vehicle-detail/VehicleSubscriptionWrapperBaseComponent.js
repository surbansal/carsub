import {Component} from 'react';
import PropTypes from 'prop-types';
import './VehicleSubscriptionWrapperComponent.scss';
import {Api, segmentAnalytics} from '../../config/ApplicationContext';

class VehicleSubscriptionWrapperBaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubscriptionOptionsComplete = this.handleSubscriptionOptionsComplete.bind(this);
    this.handlePersonalInformationComplete = this.handlePersonalInformationComplete.bind(this);
    this.handleOnPersonalInformationStepSaving = this.handleOnPersonalInformationStepSaving.bind(this);
    this.handleOnDeliveryOptionsStepSaving = this.handleOnDeliveryOptionsStepSaving.bind(this);
    this.handleOnPaymentInformationStepSaving = this.handleOnPaymentInformationStepSaving.bind(this);
    this.handleDeliveryOptionComplete = this.handleDeliveryOptionComplete.bind(this);
    this.handlePaymentInfoComplete = this.handlePaymentInfoComplete.bind(this);
    this.handleMileagePackageUpdate = this.handleMileagePackageUpdate.bind(this);
  }

  getStripeKey() {
    Api.get('/configuration').then((response) => {
      this.setState({
        stripePublicKey: response.stripePublicKey
      });
    });
  }
  handleMileagePackageUpdate(mileagePack) {
    this.setState({
      mileagePackage: mileagePack
    });
  }
  handleOnPersonalInformationStepSaving(args) {
    this.setState({
      personalInformationStepSaving: args.isSaving,
      isStepSaving: args.isSaving
    });
  }
  handleOnDeliveryOptionsStepSaving(args) {
    this.setState({
      deliveryOptionsStepSaving: args.isSaving,
      isStepSaving: args.isSaving
    });
  }
  handleOnPaymentInformationStepSaving(args) {
    this.setState({
      paymentInformationStepSaving: args.isSaving,
      isStepSaving: args.isSaving
    });
  }

  completeSubscriptionRequest() {
    const subscription = {
      subscriptionOptions: this.state.subscriptionOptions,
      personalInformation: this.state.personalInformation,
      deliveryOptions: this.state.deliveryOptions,
      paymentInformation: this.state.paymentInformation,
      vehicle: this.state.vehicle,
      monthlyCost: this.state.paymentInformation.monthlyCost,
      trackedLead: this.state.leadsData.publicId
    };
    Api.post('/subscription', subscription).then((response) => {
      const billingDetails = subscription.paymentInformation;
      // eslint-disable-next-line no-undef
      gtag(
        'event', 'conversion',
        {
          send_to: 'AW-797899311/mMDyCM-514UBEK_0u_wC',
          value: billingDetails.monthlyCost,
          currency: 'USD',
          transaction_id: billingDetails.paymentToken
        }
      );
      segmentAnalytics.track('Order Completed', {
        order_id: this.state.vehicle.publicId,
        checkout_id: billingDetails.paymentToken,
        currency: 'USD',
        total: billingDetails.monthlyCost,
        products: [
          {
            product_id: this.state.vehicle.publicId,
            sku: this.state.vehicle.publicId,
            name: `${this.state.vehicle.configuration.model.year} ${this.state.vehicle.configuration.model.manufacturer.name} ${this.state.vehicle.configuration.model.name}`,
            category: 'Subscriptions',
            quantity: 1,
            price: billingDetails.monthlyCost,
            revenue: billingDetails.monthlyCost
          }
        ]
      });

      segmentAnalytics.track('Captured Credit Card, Scheduled Delivery, Agree to digital T&C\'s', {
        category: 'Reservation'
      });
      this.props.history.push({
        pathname: '/confirm-email',
        search: `subscription=${response.publicId}&verification=${response.verificationToken}&email-verification=${response.emailVerificationToken}&email=${response.personalInformation.email}`
      });
      this.setState(this.state);
    }).catch((response) => {
      // Credit card validation can only happen here
      response.json().then((data) => {
        this.setState({
          subscriptionFailureResponse: data
        });
      });
    });
  }

  render() {
    return null;
  }
}

VehicleSubscriptionWrapperBaseComponent.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default VehicleSubscriptionWrapperBaseComponent;
