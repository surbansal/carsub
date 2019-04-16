/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
/* jsx-a11y/no-static-element-interactions */
import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import Moment from 'react-moment';
import EditableLabel from 'react-inline-editing';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import ProgressBarComponent from '../accounts/ProgressBarComponent';
import './MyAccountPage.scss';
import pdfLogo from '../../assets/images/adobe-pdf-icon.png';
import cal from '../../assets/images/cal.png';
import accidentIcon from '../../assets/images/accident.png';
import wrenchIcon from '../../assets/images/wrench.png';
import skyBlueArrowRight from '../../assets/images/a3-right-arrow.png';
import RequiresLogin from '../layout/RequiresLogin';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';
import {
  Api,
  contractService,
  ContentfulService,
  isProgressiveWebappEnabled,
  segmentAnalytics,
  userService,
} from '../../config/ApplicationContext';
import ZipCodeService from '../../services/api/ZipCodeService';
import AddToHomescreenModal from '../modal/AddToHomescreenModal';
import {addToHomeScreen, mathesPromptCriteria} from '../../installEvents';
import OfflineIndicator from '../OfflineIndicator';
import smallCarIcon from '../../assets/images/icon-car-small.png';
import LoadingIndicator from '../LoadingIndicator';
import MarkdownContent from '../content/MarkdownContent';

class MyAccountPage extends Component {
  constructor(props) {
    super(props);

    this.myAccountLinks = [
      {name: 'Roadside Assistance', link: '/roadside-assist'},
      {name: 'Schedule Maintenance', link: '/schedule-maintenance'},
      {name: 'Accident Instructions', link: '/accident-instructions'},
      {name: 'Manage Payment Methods', link: '/manage-payment'},
      {name: 'Change Password', link: '/change-password'}
    ];

    this.state = {
      loaded: false,
      carHeader: '',
      carName: '',
      subscriptionExpiryDate: '',
      subscriptionTotalMiles: '',
      mileage: { },
      months: { },
      contractDownloadLocation: '',
      carInspectionDownloadLocation: '',
      subscriptionId: '',
      isOffline: false,
      errors: {
        carName: false,
        carNameMessage: '',
      },
      showAddPrompt: mathesPromptCriteria() && isProgressiveWebappEnabled,
      displayRenewOptionsNotification: false,
      showAwaitingContractNotification: false,
      content: null,
    };
    this.handleCarNameChange = this.handleCarNameChange.bind(this);
    this.handleAddToHomePrompt = this.handleAddToHomePrompt.bind(this);
    this.handleNoForAddToHomePrompt = this.handleNoForAddToHomePrompt.bind(this);
    this.handleScheduleMaintenanceClick = this.handleScheduleMaintenanceClick.bind(this);
    this.handleAccidentInstructionsClick = this.handleAccidentInstructionsClick.bind(this);
    this.closeRenewalNotification = this.closeRenewalNotification.bind(this);
    this.closeEsignNotification = this.closeEsignNotification.bind(this);
    this.showSuccessfulSignNotification = this.showSuccessfulSignNotification.bind(this);
    this.navToRenewalNotification = this.navToRenewalNotification.bind(this);
    this.signPendingContract = this.signPendingContract.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    ContentfulService.getEntries({ 'sys.id': '2xXf2qJbSfvdg0LT6J3X5p', include: 5 }).then((resp) => {
      this.setState({
        content: resp.items[0].fields
      });
    });
    userService.getLoggedInUser().then((user) => {
      if (user !== null) {
        if (!ZipCodeService.getZipCookie()) {
          ZipCodeService.setZipCode(user.getHomeZipCode());
        }
        Api.get('/subscription/current/contract').then((response) => {
          this.setState({
            contractDownloadLocation: response.location
          });
        }).catch((error) => {
          if (error.status === undefined) {
            this.setState({
              loaded: true,
              isOffline: true
            });
          }
        });
        Api.get('/subscription/renewed/contract').then((response) => {
          this.setState({
            renewalContractDownloadLocation: response.location
          });
        }).catch((error) => {
          if (error.status === undefined) {
            this.setState({
              loaded: true,
              isOffline: true
            });
          }
        });
        Api.get('/subscription/current/carinspection').then((response) => {
          this.setState({
            carInspectionDownloadLocation: response.location
          });
        }).catch((error) => {
          if (error.status === undefined) {
            this.setState({
              loaded: true,
              isOffline: true
            });
          }
        });
        Api.get('/subscription/current').then((response) => {
          if (response.unsignedContract) {
            contractService.getContractStatus(response.unsignedContract.publicId).then((contractInfo) => {
              if (contractInfo.contractStatus === 'AWAITING_SIGNATURE' && !sessionStorage.getItem('hide_esign_notification_currentsession')) {
                this.setState({ showAwaitingContractNotification: true });
              }
            });
          }
          const miles = response.subscriptionOptions.mileageValue;
          const subscriptionLengthValue = response.subscriptionOptions.subscriptionLength.value;
          const totalPackageMiles = miles * subscriptionLengthValue;
          const totalAddsOnMiles = response.mileageAdditions.reduce((cnt, o) => { return cnt + o.miles; }, 0);
          const totalMiles = totalPackageMiles + totalAddsOnMiles;
          const mileage = {
            unit: 'miles',
            min: 0,
            actual: response.subscriptionUsage.currentMileageUsage,
            max: (response.subscriptionOptions.mileageValue * response.subscriptionOptions.subscriptionLengthValue) + totalAddsOnMiles,
            isUnlimited: (response.subscriptionOptions.mileagePackage.unit === 'UNLIMITED_MILES'),
            addOnsTotalMiles: totalAddsOnMiles,
            totalMiles
          };

          const months = {
            unit: 'months',
            singularUnit: 'month',
            min: 0,
            actual: response.subscriptionUsage.subscribedDays / 30.0,
            max: response.subscriptionOptions.subscriptionLengthValue,
            isUnlimited: false
          };
          if (months.actual < 0) {
            months.actual = 0;
          }
          const vehicleModel = response.vehicle.configuration.model;
          this.setState({
            loaded: true,
            mileage,
            months,
            subscriptionExpiryDate: response.subscriptionUsage.subscriptionEndDate,
            subscriptionTotalMiles: totalPackageMiles,
            carHeader: `${vehicleModel.year} ${vehicleModel.manufacturer.name} ${vehicleModel.name}`,
            carName: `${response.carName}`,
            vehicle: response.vehicle,
            unsignedContract: response.unsignedContract,
            subscriptionId: `${response.publicId}`,
            nextPaymentDueDate: response.nextPaymentDueDate,
            nextPaymentAmount: response.nextPaymentAmount,
            isRenewed: response.subscriptionRenewed,
            displayRenewOptionsNotification: response.showSubscriptionEndOfTermNotice && !sessionStorage.getItem('hide_renewal_notification_currentsession')
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
    });
    if (params.get('event') === 'signing_complete') {
      params.delete('event');
      window.history.pushState('', '', `${window.location.pathname}?${params.toString()}`);
      this.showSuccessfulSignNotification(true);
      this.closeEsignNotification();
    }
  }

  handleCarNameChange(carName) {
    const requestBody = {
      subscriptionId: this.state.subscriptionId,
      carName
    };
    Api.post('/subscription/carName', requestBody).then(() => {
      const {errors} = this.state;
      errors.carName = true;
      errors.carNameMessage = '';
      this.setState({
        carName,
        errors
      });
    }).catch((response) => {
      if (response.status === undefined) {
        this.setState({
          loaded: true,
          isOffline: true
        });
      } else {
        response.json().then((data) => {
          const {errors} = this.state;
          errors.carName = true;
          errors.carNameMessage = data.validationErrors[0].message;
          this.setState({
            errors
          });
        });
      }
    });
  }

  closeRenewalNotification() {
    segmentAnalytics.track('Minimize Renewal Reminder', { category: 'Notifications'});
    sessionStorage.setItem('hide_renewal_notification_currentsession', true);
    this.setState({
      displayRenewOptionsNotification: false
    });
  }
  closeEsignNotification() {
    sessionStorage.setItem('hide_esign_notification_currentsession', true);
    this.setState({
      showAwaitingContractNotification: false
    });
  }
  showSuccessfulSignNotification(showNotification) {
    this.setState({
      showSuccessfulSigningNotification: showNotification
    });
  }
  navToRenewalNotification() {
    segmentAnalytics.track('Navigate to Renewal Options', { category: 'Notifications'});
    this.setState({
      displayRenewOptionsNotification: false
    });
  }
  signPendingContract() {
    contractService.generateMyAccountContractSignUrl(this.state.unsignedContract.publicId).then((signUrl) => {
      window.location.assign(signUrl);
    });
  }
  handleAddToHomePrompt() {
    this.setState({showAddPrompt: false});
    addToHomeScreen();
  }

  handleNoForAddToHomePrompt() {
    this.setState({showAddPrompt: false});
  }

  handleScheduleMaintenanceClick() {
    this.props.history.push({pathname: '/schedule-maintenance'});
  }

  handleAccidentInstructionsClick() {
    this.props.history.push({pathname: '/accident-instructions'});
  }

  render() {
    if (!this.state.loaded) {
      return (
        <RequiresLogin redirectTo="/login">
          <LoadingIndicator />
        </RequiresLogin>
      );
    } else if (this.state.isOffline) {
      return (
        <RequiresLogin redirectTo="/login">
          <OfflineIndicator />
        </RequiresLogin>
      );
    }
    const mileageToDate = this.state.mileage.isUnlimited ?
      'Unlimited' : `${this.state.mileage.actual} ${this.state.mileage.unit}`;
    if (!this.state.content) {
      return <LoadingIndicator />;
    }
    const awaitingSigningContent = this.state.content.awaitingSigningContractNotification;
    const successfulSigningContent = this.state.content.successfulSigningContractNotification;
    const renewOptionsContent = this.state.content.renewOptionsNotification;
    return (
      <RequiresLogin redirectTo="/login">
        <Fragment>
          <AddToHomescreenModal
            showModal={this.state.showAddPrompt}
            handleSubmit={this.handleAddToHomePrompt}
            handleNo={this.handleNoForAddToHomePrompt}
          />
          <MyAccountHeaderAndFooterPage className="my-account-background">
            <div className="my-account-page">
              {this.state.displayRenewOptionsNotification ? (
                <div className="notification rectangle notice-msg">
                  <div className="notification-content">
                    <div className="notice"><MarkdownContent markdown={renewOptionsContent.fields.notificationText} /></div>
                    <div className="notification-close" onClick={this.closeRenewalNotification} />
                  </div>
                  <Link to="/renewal-preference" className="renwal-options-link notice-text" onClick={this.navToRenewalNotification}>{renewOptionsContent.fields.buttonText}</Link>
                </div>
              ) : <Fragment />}
              {this.state.showAwaitingContractNotification ? (
                <div className="notification rectangle notice-msg">
                  <div className="notification-content">
                    <div className="notice"><MarkdownContent markdown={awaitingSigningContent.fields.notificationText} /></div>
                    <div className="notification-close" onClick={this.closeEsignNotification} />
                  </div>
                  <button className="link-button renwal-options-link notice-text" onClick={this.signPendingContract}>{awaitingSigningContent.fields.buttonText}</button>
                </div>
              ) : <Fragment />}
              {this.state.showSuccessfulSigningNotification ? (
                <div className="notification rectangle info-msg">
                  <div className="notification-content">
                    <div className="notice">
                      {this.state.isRenewed ?
                        <MarkdownContent markdown={successfulSigningContent.fields.isRenewedNotificationText} />
                        :
                        <MarkdownContent markdown={successfulSigningContent.fields.notificationText} />
                      }
                    </div>
                    <div className="notification-close" onClick={() => this.showSuccessfulSignNotification(false)} />
                  </div>
                </div>
              ) : <Fragment />}
              <div className="my-account-section sub-status-section">
                <div className="my-account">
                  <h3 className="medium">My Account</h3>
                </div>
                <div className="grey-line mobile-only" />
                <div className="line-gradient desktop-only" />
                <EditableLabel
                  text={this.state.carName}
                  onFocusOut={this.handleCarNameChange}
                  labelClassName="editable-section"
                  inputClassName="editable-section wide"
                />
                <p className={ this.state.errors.carName ? 'error-message' : 'hide-error'}>{ this.state.errors.carNameMessage }</p>
                <h3>{this.state.carHeader}</h3>
                <img className="my-account-car" src={Api.resolve(`/media/${this.state.vehicle.imageStorageId}`)} alt="car" />
                <div className="sub-status-data">
                  <div className="progress-status">
                    <span className="small grey-text">Mileage to date:</span>
                    <h2>{mileageToDate}</h2>
                  </div>
                  <div className="progress-status">
                    <span className="small grey-text">Months into subscription:</span>
                    <h2>
                      <NumberFormat
                        displayType="text"
                        decimalScale={0}
                        decimalSeparator=""
                        value={Math.floor(this.state.months.actual)}
                      /> {Math.floor(this.state.months.actual) === 1 ? this.state.months.singularUnit : this.state.months.unit}
                    </h2>
                  </div>
                </div>
                <div className="sub-status-data">
                  <div className="progress-status">
                    <div className="progress">
                      <ProgressBarComponent {...this.state.mileage} />
                    </div>
                  </div>
                  <div className="progress-status">
                    <div className="progress">
                      <ProgressBarComponent {...this.state.months} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-account-section upcoming-payments">
                <div className="upcoming-payments-label">
                  <div className="mobile-upcoming-label mobile-only">
                    <img src={cal} alt="car" className="cal-image" />
                    <h3>Next Payment</h3>
                  </div>
                  <h3 className="desktop-only">Upcoming Payments</h3>
                </div>
                <span className="upcoming-payment">
                  <h2 className="payment-label mobile-only">Payment Date</h2>
                  <h2 className="payment-label desktop-only">Due Date</h2>
                  <h2 className="payment-value mobile-only">{this.state.nextPaymentDueDate ? <Moment date={this.state.nextPaymentDueDate} format="MM/DD/YY" /> : 'N/A'}</h2>
                  <h2 className="payment-value desktop-only">{this.state.nextPaymentDueDate ? <Moment date={this.state.nextPaymentDueDate} format="MMMM DD YYYY" /> : 'N/A'}</h2>
                </span>
                <span className="upcoming-payment">
                  <h2 className="payment-label mobile-only">Payment Amount</h2>
                  <h2 className="payment-label desktop-only">Amount Due</h2>
                  <h2 className="payment-value">{this.state.nextPaymentAmount ? <NumberFormat displayType="text" decimalScale={2} decimalSeparator="." value={this.state.nextPaymentAmount} prefix="$" /> : 'N/A'}</h2>
                </span>
                <Link to="/manage-payment" className="manage-payment-link mobile-only">Manage Payments</Link>
              </div>
              <div className="my-account-section sub-info-section">
                <div className="sub-info-section-label">
                  <img src={smallCarIcon} alt="" className="small-car-image mobile-only" />
                  <h3>Subscription Information</h3>
                </div>
                <span className="small grey-text mobile-only">Expiration  Date</span>
                <div className="add-ons mobile-only">
                  <h2>Add-Ons</h2>
                  <div className="miles-added">
                    <h2>Total Miles Added</h2>
                    <h2 className="miles-value"><span>{this.state.mileage.addOnsTotalMiles}</span></h2>
                  </div>
                  <div className="link">
                    <Link to="/add-ons">View all Add-Ons</Link>
                  </div>
                </div>
                <h2 className="mobile-only">Expires <Moment date={this.state.subscriptionExpiryDate} format="MM.DD.YYYY" /></h2>
                <h2 className="desktop-only"><Moment date={this.state.subscriptionExpiryDate} format="MM/DD/YYYY" /></h2>
                <div className="mileage-section mobile-only">
                  <span className="small grey-text">Mileage</span>
                  <div className="subscription-miles-section">
                    <div className="subscription-miles">
                      <span>Subscription Package</span>
                      <span className="horizontal-line" />
                      <span className="subscription-total-miles">{this.state.subscriptionTotalMiles}</span>
                    </div>
                  </div>
                  <div className="add-on-miles-section">
                    <div className="miles">
                      <span> Add-On Mileage</span>
                      <span className="horizontal-line" />
                      <span className="add-ons-total-miles">{this.state.mileage.addOnsTotalMiles}</span>
                    </div>
                  </div>
                  <div className="total-miles-section">
                    <span>Total Miles</span>
                    <span className="horizontal-line" />
                    <span>{this.state.mileage.totalMiles}</span>
                  </div>
                </div>
                <div className="subscription-documents desktop-only">
                  {this.state.contractDownloadLocation && (
                    <div className="subscription-document">
                      <a href={this.state.contractDownloadLocation} onClick={() => segmentAnalytics.track('Contract viewed', {category: 'My Account interaction'})} target="_blank">
                        <span className="pdf-logo-download">
                          <img src={pdfLogo} alt="pdf logo" />
                          View your contract (PDF)
                        </span>
                      </a>
                    </div>
                  )}
                  {this.state.renewalContractDownloadLocation && (
                    <div className="subscription-document">
                      <a href={this.state.renewalContractDownloadLocation} target="_blank">
                        <span className="pdf-logo-download">
                          <img src={pdfLogo} alt="pdf logo" />
                          View your renewal contract (PDF)
                        </span>
                      </a>

                    </div>)
                  }
                  {this.state.carInspectionDownloadLocation ? (
                    <div className="subscription-document">
                      <a href={this.state.carInspectionDownloadLocation} onClick={() => segmentAnalytics.track('Inspection Report viewed', {category: 'My Account interaction'})} target="_blank">
                        <span className="pdf-logo-download">
                          <img src={pdfLogo} alt="pdf logo" />
                          View car inspection report (PDF)
                        </span>
                      </a>

                    </div>) : (<Fragment />)
                  }
                  <div className="renewal-info">
                    <p>Renew your subscription by calling the following number any time within a month of your subscription expiry date:</p>
                    <h2><a href="tel:18003602228">1-800-360-2228</a></h2>
                  </div>
                </div>
                <div className="link mobile-only">
                  <Link to="/subscription-details" className="view-sub-details-link">View Subscription Details</Link>
                </div>
              </div>
              <div className="my-account-section maintenance-section">
                <div className="maintenance-action-icons" onClick={this.handleScheduleMaintenanceClick}>
                  <img src={wrenchIcon} alt="Schedule Maintenance" />
                  <span className="icon-text">Schedule Maintenance</span>
                </div>
                <div className="maintenance-action-icons" onClick={this.handleAccidentInstructionsClick}>
                  <img src={accidentIcon} alt="Accident Instructions" />
                  <span className="icon-text">Accident Instructions</span>
                </div>
              </div>
              <div className="my-account-section sub-account-section desktop-only">
                <h3>Manage your Account</h3>
                <div className="account-data">
                  {this.myAccountLinks.map((accountData) => {
                    return (
                      <div key={accountData.name} className="account-link h3">
                        <Link to={accountData.link}>{accountData.name} <img className="arrow" src={skyBlueArrowRight} alt="arrow right" /></Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </MyAccountHeaderAndFooterPage>
        </Fragment>
      </RequiresLogin>
    );
  }
}

MyAccountPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(MyAccountPage);
