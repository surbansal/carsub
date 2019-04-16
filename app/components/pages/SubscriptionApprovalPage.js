import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { Element, scroller } from 'react-scroll';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './MessagingPage.scss';
import { Api, segmentAnalytics } from '../../config/ApplicationContext';
import SubscriptionVehicle from '../subscription/SubscriptionVehicle';
import './SubscriptionApprovalPage.scss';
import PasswordEntryComponent from '../accounts/PasswordEntryComponent';
import ConfirmationBreakdown from '../subscription/ConfirmationBreakdown';

class SubscriptionApprovalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionInfo: {},
      confirmationRequest: {
        subscriptionId: '',
        verificationCode: '',
        deliveryInstructions: {
          instructions: ''
        },
        carName: '',
        email: '',
        password: ''
      },
      errors: {
        password: false,
        passwordMessage: ''
      }
    };
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onCarNameChange = this.onCarNameChange.bind(this);
    this.onInstructionsChange = this.onInstructionsChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const subscriptionId = params.get('subscription');
    const verificationCode = params.get('verification');
    Api.get(`/subscription?id=${subscriptionId}&verification=${verificationCode}`).then((response) => {
      if (response.status === 'CONFIRMED') {
        this.props.history.push({
          pathname: '/subscription-completion',
          search: `subscription=${params.get('subscription')}&verification=${params.get('verification')}`,
          state: { subscription: this.state.subscriptionInfo }
        });
        return;
      } else if (response.status === 'APPROVED') {
        if (params.get('event')) {
          const contractSignStatus = params.get('event');
          if (contractSignStatus !== 'signing_complete' && contractSignStatus !== 'viewing_complete') {
            this.props.history.push({
              pathname: '/confirmation',
              search: `subscription=${params.get('subscription')}&verification=${params.get('verification')}`
            });
            return;
          }
        }
      } else if (response.status !== 'APPROVED') {
        this.props.history.push({
          pathname: '/confirmation',
          search: `subscription=${params.get('subscription')}&verification=${params.get('verification')}`
        });
        return;
      }
      const { confirmationRequest } = this.state;
      confirmationRequest.subscriptionId = subscriptionId;
      confirmationRequest.verificationCode = verificationCode;
      confirmationRequest.email = response.email;
      this.setState({
        subscriptionInfo: response,
        confirmationRequest
      });
    });
  }

  onPasswordChange(password) {
    const { confirmationRequest } = this.state;
    confirmationRequest.password = password;

    const errorsTemp = this.state.errors;
    errorsTemp.password = false;
    errorsTemp.passwordMessage = '';

    this.setState({
      confirmationRequest,
      errors: errorsTemp
    });
  }

  onCarNameChange(e) {
    const { confirmationRequest } = this.state;
    confirmationRequest.carName = e.target.value;
    this.setState({
      confirmationRequest
    });
  }

  onInstructionsChange(e) {
    const { confirmationRequest } = this.state;
    confirmationRequest.deliveryInstructions.instructions = e.target.value;
    this.setState({
      confirmationRequest
    });
  }

  onSubmit() {
    Api.post('/subscription/confirmation', this.state.confirmationRequest).then((user) => {
      segmentAnalytics.identifyUser(user.publicId, {
        email: user.email
      });
      segmentAnalytics.track('Account Created', {
        category: 'Confirmed'
      });


      const params = new URLSearchParams(this.props.location.search);
      this.props.history.push({
        pathname: '/subscription-completion',
        search: `subscription=${params.get('subscription')}&verification=${params.get('verification')}`,
        state: { subscription: this.state.subscriptionInfo }
      });
    }).catch((response) => {
      response.json().then((data) => {
        const { errors } = this.state;
        errors.password = true;
        errors.passwordMessage = data.validationErrors[0].message;
        this.setState({
          errors
        });
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleScrollToAccountSetup(event) {
    event.preventDefault();
    scroller.scrollTo('finish-account-setup', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  render() {
    const { subscriptionInfo } = this.state;
    if (!subscriptionInfo || !subscriptionInfo.vehicle || subscriptionInfo.status !== 'APPROVED') {
      return <div />;
    }
    return (
      <HeaderAndFooterPage>
        <div className="messaging-page subscription-approval">
          <div className="header-info">
            <h1>Congratulations, you&#39;ve been approved!</h1>
            <p className="text-center">Your {subscriptionInfo.vehicle.configuration.model.year} {subscriptionInfo.vehicle.configuration.model.manufacturer.name} {subscriptionInfo.vehicle.configuration.model.name} will be delivered on the {subscriptionInfo.deliveryTimeFrame.displayName} of
              &nbsp;<Moment date={subscriptionInfo.deliveryDate} format="MMMM Do" />
            </p>
          </div>
          <div className="finish-setup">
            <Link to="/" onClick={this.handleScrollToAccountSetup}>Finish setting up your account</Link>
          </div>
          <div className="messaging-content-approval">
            <SubscriptionVehicle vehicle={subscriptionInfo.vehicle}>
              <ConfirmationBreakdown subscription={subscriptionInfo} />
            </SubscriptionVehicle>
            <div className="approval-steps-container">
              <Element name="finish-account-setup">
                <div className="approval-steps">
                  <div className="user-account">
                    <h2>Finish Setting up your Account</h2>
                    <label className="email">Email
                      <input type="text" value={this.state.confirmationRequest.email} className="email-input" readOnly />
                    </label>
                    <PasswordEntryComponent isError={this.state.errors.password} errorMessage={this.state.errors.passwordMessage} sendData={(val) => { this.onPasswordChange(val); }} />
                    <label className="car">Give your car a name!
                      <input type="text" className="car-input" value={this.state.confirmationRequest.carName} onChange={this.onCarNameChange} />
                    </label>
                    <label className="car">Any delivery instructions?
                      <input type="text" placeholder="Example: it requires a gate code" className="car-input" value={this.state.confirmationRequest.deliveryInstructions.instructions} onChange={this.onInstructionsChange} />
                    </label>
                    <button className="csa-button primary" onClick={this.onSubmit}>Complete Registration</button>
                  </div>
                </div>
              </Element>
            </div>
          </div>
        </div>
      </HeaderAndFooterPage>
    );
  }
}

SubscriptionApprovalPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(SubscriptionApprovalPage);
