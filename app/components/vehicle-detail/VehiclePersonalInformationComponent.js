import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import './VehiclePersonalInformationComponent.scss';
import PhoneInput from '../input-masks/PhoneInputComponent';
import DateOfBirthInput from '../input-masks/DateOfBirthInputComponent';
import infoIconImage from '../../assets/images/info-icon.png';
import VehicleType from '../../types/VehicleType';
import {Api, logService, segmentAnalytics} from '../../config/ApplicationContext';
import AddressAutocompleteComponent from '../layout/AddressAutocompleteComponent';
import DateService from '../../services/api/DateService';
import SubscriptionHelperService from './SubscriptionHelperService';
import ThirdPartyAnalytics from '../../services/ThirdPartyAnalytics';
import * as SeverityType from '../../constants/SeverityType';

class VehiclePersonalInformationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: props.vehicle,
      isVerificationCodeSent: false,
      isSaving: false,
      approveSendingText: false,
      personalInformation: {
        firstName: '',
        middleName: '',
        lastName: '',
        middleNamePresent: false,
        email: '',
        dob: null,
        dobString: '',
        driverLicenseNumber: '',
        driverLicenseState: '',
        phone: {
          phoneNumber: ''
        },
        homeAddress: {
          streetAddress2: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      },
      errors: {
        firstName: false,
        middleName: false,
        lastName: false,
        nameMessage: '',
        middleNameMessage: '',
        lastNameMessage: '',
        email: false,
        emailMessage: '',
        driverLicenseNumber: false,
        driverLicenseNumberMessage: '',
        phoneNumber: false,
        phoneNumberMessage: '',
        homeAddress: false,
        homeAddressMessage: '',
        streetAddress: false,
        streetAddressMessage: '',
        city: false,
        cityMessage: '',
        state: false,
        stateMessage: '',
        zipCode: false,
        zipCodeMessage: '',
        country: false,
        countryMessage: '',
        verificationCode: false,
        verificationCodeMessage: '',
        driverLicenseState: false,
        driverLicenseStateMessage: '',
        dob: false,
        dobMessage: ''
      },
      verificationCode: {
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: '',
        digit5: ''
      }
    };

    this.digit2Ref = React.createRef();
    this.digit3Ref = React.createRef();
    this.digit4Ref = React.createRef();
    this.digit5Ref = React.createRef();

    this.handleSubmitDetailsClick = this.handleSubmitDetailsClick.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleAptNoChange = this.handleAptNoChange.bind(this);
    this.handleDriverLicenseChange = this.handleDriverLicenseChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handleCodeDigit1Change = this.handleCodeDigit1Change.bind(this);
    this.handleCodeDigit2Change = this.handleCodeDigit2Change.bind(this);
    this.handleCodeDigit3Change = this.handleCodeDigit3Change.bind(this);
    this.handleCodeDigit4Change = this.handleCodeDigit4Change.bind(this);
    this.handleCodeDigit5Change = this.handleCodeDigit5Change.bind(this);
    this.handleDobChange = this.handleDobChange.bind(this);
    this.handleSendVerificationCode = this.handleSendVerificationCode.bind(this);
    this.resetVerificationCodeState = this.resetVerificationCodeState.bind(this);
    this.handleApproveSmsChange = this.handleApproveSmsChange.bind(this);
    VehiclePersonalInformationComponent.stateList = VehiclePersonalInformationComponent.stateList || [
      'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
    ];
  }

  handleSendVerificationCode() {
    SubscriptionHelperService.setIsSaving(this, true);
    Api.get(`/phone/verification?phoneNumber=${this.state.personalInformation.phone.phoneNumber}`).then((response) => {
      SubscriptionHelperService.setIsSaving(this, false);
      this.clearValidations();
      const enteredAddress = this.state.personalInformation.homeAddress;
      const { personalInformation } = this.state;
      personalInformation.phone = response;
      personalInformation.homeAddress = enteredAddress;

      segmentAnalytics.track('Phone Verification Code Sent', {
        category: 'Lead'
      });

      this.setState({
        personalInformation,
        isVerificationCodeSent: true,
      });
    }).catch((response) => {
      SubscriptionHelperService.setIsSaving(this, false);

      response.json().then((data) => {
        const errorsTemp = this.state.errors;
        errorsTemp.phoneNumber = true;
        errorsTemp.phoneNumberMessage = data.validationErrors[0].message;
        this.setState({
          errors: errorsTemp
        });
      });
    });
  }

  verifyPhone() {
    const code = `${this.state.verificationCode.digit1}${this.state.verificationCode.digit2}${this.state.verificationCode.digit3}${this.state.verificationCode.digit4}${this.state.verificationCode.digit5}`;
    const body = {
      phone: this.state.personalInformation.phone,
      verificationCode: code
    };
    return Api.post('/phone/verification', body).catch((response) => {
      return response.json().then((data) => {
        const errorsTemp = this.state.errors;
        errorsTemp.verificationCode = true;
        errorsTemp.verificationCodeMessage = data.validationErrors[0].message;
        this.setState({
          errors: errorsTemp
        });
        return Promise.reject(new Error('Failed phone validation'));
      });
    });
  }
  personalInfoLead() {
    return Api.post(`/subscription/leads/${this.props.leadsData.publicId}/personal-information`, this.state.personalInformation).then((response) => {
      this.clearValidations();
      ThirdPartyAnalytics.event({
        category: 'Prospect',
        action: 'Captured Email, Home Address & Driver\'s License'
      });
      segmentAnalytics.identify({
        firstname: this.state.personalInformation.firstName,
        lastname: this.state.personalInformation.lastName,
        email: this.state.personalInformation.email,
        phone: this.state.personalInformation.phone.phoneNumber,
        mobilephone: this.state.personalInformation.phone.phoneNumber,
        address: this.state.personalInformation.homeAddress.streetAddress,
        city: this.state.personalInformation.homeAddress.city,
        state: this.state.personalInformation.homeAddress.state,
        zip: this.state.personalInformation.homeAddress.zipCode,
        lifecyclestage: 'lead'
      });
      this.resetVerificationCodeState();

      this.props.onComplete({
        personalInformation: response
      });
    }).catch((response) => {
      this.parseErrors(response);
      return Promise.reject(new Error('Failed lead'));
    });
  }
  async handleSubmitDetailsClick() {
    SubscriptionHelperService.setIsSaving(this, true);
    try {
      await this.verifyPhone();
      await this.personalInfoLead();
    } finally {
      SubscriptionHelperService.setIsSaving(this, false);
    }
  }

  clearValidations() {
    this.setState({
      errors: {
        firstName: false,
        lastName: false,
        nameMessage: '',
        email: false,
        emailMessage: '',
        driverLicenseNumber: false,
        driverLicenseNumberMessage: '',
        phoneNumber: false,
        phoneNumberMessage: '',
        homeAddress: false,
        homeAddressMessage: '',
        streetAddress2: '',
        streetAddress2Message: '',
        streetAddress: false,
        streetAddressMessage: '',
        city: false,
        cityMessage: '',
        state: false,
        stateMessage: '',
        zipCode: false,
        zipCodeMessage: '',
        country: false,
        countryMessage: '',
        verificationCode: false,
        verificationCodeMessage: ''
      }
    });
  }

  parseErrors(response) {
    response.json().then((data) => {
      let logMessage;
      let logSeverity;
      let logCategory;
      if (data.validationErrors) {
        logSeverity = SeverityType.WARN;
        logCategory = 'Validation Error';
        data.validationErrors.forEach((field) => {
          const errorsTemp = this.state.errors;
          errorsTemp[field.property] = true;
          const errorMessage = `${field.property}Message`;
          errorsTemp[errorMessage] = field.message;
          logMessage = (logMessage) ? `${logMessage}${field.property} - ${field.message} \n ` : `${field.property} - ${field.message} \n `;
          this.setState({
            errors: errorsTemp
          });
        });
      } else {
        // This is 500 server error scenario
        logSeverity = SeverityType.ERROR;
        logMessage = data.message;
        logCategory = 'System Error';
      }
      logService.logErrors(logMessage, logSeverity, logCategory, null, this.props.leadsData.publicId);
    });
  }
  resetVerificationCodeState() {
    this.setState({
      isVerificationCodeSent: false,
      verificationCode: {
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: '',
        digit5: ''
      }
    });
  }
  handleFirstNameChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.firstName = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.firstName = false;
    errorsTemp.firstNameMessage = '';
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }
  handleMiddleNameChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.middleName = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.middleName = false;
    errorsTemp.middleNameMessage = '';
    if (personalInformationTemp.middleName.trim().length > 0) {
      personalInformationTemp.middleNamePresent = true;
    } else {
      personalInformationTemp.middleNamePresent = false;
    }
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }
  handleLastNameChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.lastName = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.lastName = false;
    errorsTemp.lastNameMessage = '';
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }

  handleAddressChange(selectedAddress) {
    const personalInformationTemp = this.state.personalInformation;
    const aptNo = personalInformationTemp.homeAddress.streetAddress2;
    personalInformationTemp.homeAddress = selectedAddress.selectedAddress;
    personalInformationTemp.homeAddress.streetAddress2 = aptNo;
    const errorsTemp = this.state.errors;
    errorsTemp.homeAddress = false;
    errorsTemp.homeAddressMessage = '';
    errorsTemp.state = false;
    errorsTemp.stateMessage = '';
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }
  handleAptNoChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.homeAddress.streetAddress2 = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.streetAddress2 = false;
    errorsTemp.streetAddress2Message = '';
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }
  handleDriverLicenseChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.driverLicenseNumber = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.driverLicenseNumber = false;
    errorsTemp.driverLicenseNumberMessage = '';
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }

  handleStateChange(e) {
    const { personalInformation, errors } = this.state;
    errors.driverLicenseState = false;
    errors.driverLicenseStateMessage = '';
    personalInformation.driverLicenseState = e.target.value;
    this.setState({
      personalInformation,
      errors
    });
  }

  handleEmailChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.email = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.email = false;
    errorsTemp.emailMessage = '';
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }

  handleDobChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.dobString = e.target.value;
    personalInformationTemp.dob = DateService.toDate(e.target.value);
    const errorsTemp = this.state.errors;
    errorsTemp.dob = false;
    errorsTemp.dobmessage = '';
    this.setState({
      personalInformation: personalInformationTemp,
      errors: errorsTemp
    });
  }

  handlePhoneNumberChange(e) {
    const personalInformationTemp = this.state.personalInformation;
    personalInformationTemp.phone.phoneNumber = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.phoneNumber = false;
    errorsTemp.phoneNumberMessage = '';
    this.setState({
      personalInformation: personalInformationTemp,
      isVerificationCodeSent: false,
      errors: errorsTemp
    });
  }

  handleCodeDigit1Change(e) {
    const verificationCodeTemp = this.state.verificationCode;

    if (e.target.value.length > 1) {
      if (verificationCodeTemp.digit1 === e.target.value.substring(0, 1)) {
        verificationCodeTemp.digit1 = e.target.value.substring(1);
      } else {
        verificationCodeTemp.digit1 = e.target.value.substring(0, 1);
      }
    } else {
      verificationCodeTemp.digit1 = e.target.value;
    }
    const errorsTemp = this.state.errors;
    errorsTemp.verificationCode = false;
    errorsTemp.verificationCodeMessage = '';

    this.setState({
      verificationCode: verificationCodeTemp,
      errors: errorsTemp
    });
    if (e.target.value !== '') {
      this.digit2Ref.current.focus();
    }
  }

  handleCodeDigit2Change(e) {
    const verificationCodeTemp = this.state.verificationCode;
    if (e.target.value.length > 1) {
      if (verificationCodeTemp.digit2 === e.target.value.substring(0, 1)) {
        verificationCodeTemp.digit2 = e.target.value.substring(1);
      } else {
        verificationCodeTemp.digit2 = e.target.value.substring(0, 1);
      }
    } else {
      verificationCodeTemp.digit2 = e.target.value;
    }
    const errorsTemp = this.state.errors;
    errorsTemp.verificationCode = false;
    errorsTemp.verificationCodeMessage = '';
    this.setState({
      verificationCode: verificationCodeTemp,
      errors: errorsTemp
    });
    if (e.target.value !== '') {
      this.digit3Ref.current.focus();
    }
  }

  handleCodeDigit3Change(e) {
    const verificationCodeTemp = this.state.verificationCode;
    if (e.target.value.length > 1) {
      if (verificationCodeTemp.digit3 === e.target.value.substring(0, 1)) {
        verificationCodeTemp.digit3 = e.target.value.substring(1);
      } else {
        verificationCodeTemp.digit3 = e.target.value.substring(0, 1);
      }
    } else {
      verificationCodeTemp.digit3 = e.target.value;
    }
    const errorsTemp = this.state.errors;
    errorsTemp.verificationCode = false;
    errorsTemp.verificationCodeMessage = '';
    this.setState({
      verificationCode: verificationCodeTemp,
      errors: errorsTemp
    });
    if (e.target.value !== '') {
      this.digit4Ref.current.focus();
    }
  }

  handleCodeDigit4Change(e) {
    const verificationCodeTemp = this.state.verificationCode;
    if (e.target.value.length > 1) {
      if (verificationCodeTemp.digit4 === e.target.value.substring(0, 1)) {
        verificationCodeTemp.digit4 = e.target.value.substring(1);
      } else {
        verificationCodeTemp.digit4 = e.target.value.substring(0, 1);
      }
    } else {
      verificationCodeTemp.digit4 = e.target.value;
    }
    const errorsTemp = this.state.errors;
    errorsTemp.verificationCode = false;
    errorsTemp.verificationCodeMessage = '';
    this.setState({
      verificationCode: verificationCodeTemp,
      errors: errorsTemp
    });
    if (e.target.value !== '') {
      this.digit5Ref.current.focus();
    }
  }

  handleApproveSmsChange() {
    this.setState({
      approveSendingText: !this.state.approveSendingText
    });
  }

  handleCodeDigit5Change(e) {
    const verificationCodeTemp = this.state.verificationCode;
    if (e.target.value.length > 1) {
      if (verificationCodeTemp.digit5 === e.target.value.substring(0, 1)) {
        verificationCodeTemp.digit5 = e.target.value.substring(1);
      } else {
        verificationCodeTemp.digit5 = e.target.value.substring(0, 1);
      }
    } else {
      verificationCodeTemp.digit5 = e.target.value;
    }
    const errorsTemp = this.state.errors;
    errorsTemp.verificationCode = false;
    errorsTemp.verificationCodeMessage = '';
    this.setState({
      verificationCode: verificationCodeTemp,
      errors: errorsTemp
    });
  }

  render() {
    if (!this.state.vehicle) {
      return null;
    }

    const verificationCodeDisplay = this.state.isVerificationCodeSent ? (
      <div className="subscribe-step-details">
        <label htmlFor="verify-code">Verification Code</label>
        <div className="verify-code-container">
          <input
            id="verify-code-1"
            className={ this.state.errors.verificationCode ? 'error single-digit' : 'single-digit' }
            type="number"
            maxLength="1"
            value={this.state.verificationCode.digit1}
            onChange={this.handleCodeDigit1Change}
          />
          <input
            id="verify-code-2"
            className={ this.state.errors.verificationCode ? 'error single-digit' : 'single-digit' }
            type="number"
            ref={this.digit2Ref}
            maxLength="1"
            value={this.state.verificationCode.digit2}
            onChange={this.handleCodeDigit2Change}
          />
          <input
            id="verify-code-3"
            className={ this.state.errors.verificationCode ? 'error single-digit' : 'single-digit' }
            type="number"
            ref={this.digit3Ref}
            maxLength="1"
            value={this.state.verificationCode.digit3}
            onChange={this.handleCodeDigit3Change}
          />
          <input
            id="verify-code-4"
            className={ this.state.errors.verificationCode ? 'error single-digit' : 'single-digit' }
            type="number"
            ref={this.digit4Ref}
            maxLength="1"
            value={this.state.verificationCode.digit4}
            onChange={this.handleCodeDigit4Change}
          />
          <input
            id="verify-code-5"
            className={ this.state.errors.verificationCode ? 'error single-digit last' : 'single-digit last' }
            type="number"
            ref={this.digit5Ref}
            maxLength="1"
            value={this.state.verificationCode.digit5}
            onChange={this.handleCodeDigit5Change}
          />
        </div>
        <button disabled={this.state.isSaving} className="resend-verification-code link" onClick={this.handleSendVerificationCode}>Resend Verification Code</button>
        <p className={ this.state.errors.verificationCode ? 'error-message' : 'hide-error'}>{ this.state.errors.verificationCodeMessage }</p>
      </div>
    ) : null;

    const submitPersonalInformationDisplay = this.state.isVerificationCodeSent ? (
      <div className="subscribe-step-details">
        <div className="submit-options">
          <button className="csa-button primary" disabled={this.state.isSaving} onClick={this.handleSubmitDetailsClick}>Submit Personal Information</button>
        </div>
        <div className="fine-print">
          <p>By verifying your information and clicking this button, you agree to our <Link to="/privacy-policy" target="_blank">privacy policy</Link> and <Link to="/terms-and-conditions" target="_blank">terms and conditions.</Link></p>
          <p>You will not be charged until the final step.</p>
        </div>
      </div>
    ) : (
      <div className="subscribe-step-details">
        <div className="submit-options">
          <button className="csa-button primary" disabled={this.state.isSaving || !this.state.approveSendingText} onClick={this.handleSendVerificationCode}>Get Verification Code</button>
        </div>
      </div>
    );

    return (
      <div className="subscribe-step">
        <h2 className="subscribe-step-heading hide">
          Personal Information
        </h2>
        <div className="subscribe-step-details">
          <label htmlFor="personFirstName" className="subscribe-step-label">Name</label>
          <div className="name-container">
            <div className="name-field">
              <input type="text" placeholder="First" id="personFirstName" className={ this.state.errors.firstName ? 'block error' : 'block'} value={this.state.personalInformation.firstName} onChange={this.handleFirstNameChange} />
            </div>
            <div className="name-field">
              <input type="text" placeholder="Middle" id="personMiddleName" className={ this.state.errors.middleName ? 'block error' : 'block'} value={this.state.personalInformation.middleName} onChange={this.handleMiddleNameChange} />
            </div>
            <div>
              <input type="text" placeholder="Last" id="personLastName" className={ this.state.errors.lastName ? 'block error' : 'block'} value={this.state.personalInformation.lastName} onChange={this.handleLastNameChange} />
            </div>
          </div>
          <p className={ this.state.errors.firstName ? 'error-message' : 'hide-error'}>{ this.state.errors.firstNameMessage }</p>
          <p className={ this.state.errors.middleName ? 'error-message' : 'hide-error'}>{ this.state.errors.middleNameMessage }</p>
          <p className={ this.state.errors.lastName ? 'error-message' : 'hide-error'}>{ this.state.errors.lastNameMessage }</p>
        </div>
        <div className="subscribe-step-details">
          <label htmlFor="homeAddress" className="subscribe-step-label">Home Address</label>
          <AddressAutocompleteComponent id="homeAddress" className={ this.state.errors.homeAddress ? 'error' : ''} onSelect={this.handleAddressChange} />
          <p className={ this.state.errors.homeAddress ? 'error-message' : 'hide-error'}>{ this.state.errors.homeAddressMessage }</p>
        </div>
        <div className="subscribe-step-details">
          <label htmlFor="appartmentNo" className="subscribe-step-label">Apt, Suite, Bldg. (Optional)</label>
          <input id="appartmentNo" type="text" className={ this.state.errors.streetAddress2 ? 'error' : ''} value={this.state.personalInformation.homeAddress.streetAddress2} onChange={this.handleAptNoChange} />
          <p className={ this.state.errors.streetAddress2Message ? 'error-message' : 'hide-error'}>{ this.state.errors.streetAddress2Message }</p>
        </div>
        <div className="subscribe-step-details">
          <div className="subscribe-step-inline">
            <div className="subscribe-step-detail-1">
              <label htmlFor="driversLicense" className="subscribe-step-label">Driver&#39;s License #
                <img data-tip="This information will be used to verify your eligibility." data-for="veh-per-info-tooltip" className="info" src={infoIconImage} alt="More Information" />
              </label>
            </div>
            <div className="subscribe-step-detail-2 state-label">
              <label htmlFor="state" className="subscribe-step-label">State</label>
            </div>
          </div>
          <div className="subscribe-step-inline">
            <div className="subscribe-step-detail-1">
              <input id="driversLicense" type="text" className={ this.state.errors.driverLicenseNumber ? 'block error' : 'block'} value={this.state.personalInformation.driverLicenseNumber} onChange={this.handleDriverLicenseChange} />
            </div>
            <div className="subscribe-step-detail-2">
              <select
                id="duration"
                value={this.state.driverLicenseState}
                onChange={this.handleStateChange}
              >
                <option />
                {VehiclePersonalInformationComponent.stateList.map((state) => {
                  return <option value={state} key={state}>{state}</option>;
                })}
              </select>
            </div>
          </div>
          <p className={ this.state.errors.driverLicenseNumber ? 'error-message' : 'hide-error'}>{ this.state.errors.driverLicenseNumberMessage }</p>
          <p className={ this.state.errors.driverLicenseState ? 'error-message' : 'hide-error'}>{ this.state.errors.driverLicenseStateMessage }</p>
        </div>
        <div className="subscribe-step-details">
          <label htmlFor="dob" className="subscribe-step-label">Date of Birth <span className="sub-text inline">(MM/DD/YYYY)</span></label>
          <DateOfBirthInput id="dob" type="text" className={ this.state.errors.dob ? 'block error' : 'block'} value={this.state.personalInformation.dobString} onChange={this.handleDobChange} />
          <p className={ this.state.errors.dob ? 'error-message' : 'hide-error'}>{ this.state.errors.dobMessage }</p>
        </div>
        <div className="subscribe-step-details">
          <label htmlFor="email" className="subscribe-step-label">Email Address</label>
          <input id="email" type="text" className={ this.state.errors.email ? 'block error' : 'block'} value={this.state.personalInformation.email} onChange={this.handleEmailChange} />
          <p className={ this.state.errors.email ? 'error-message' : 'hide-error'}>{ this.state.errors.emailMessage }</p>
        </div>

        <div className="subscribe-step-details">
          <label htmlFor="phone" className="subscribe-step-label">Mobile Phone Number</label>
          <PhoneInput id="phone" className={ this.state.errors.phoneNumber ? 'block error' : 'block'} value={this.state.personalInformation.phone.phoneNumber} onChange={this.handlePhoneNumberChange} />
          <p className={ this.state.errors.phoneNumber ? 'error-message' : 'hide-error'}>{ this.state.errors.phoneNumberMessage }</p>
          <div className="fine-print left-align sms-verify">
            <input
              id="agree-to-terms"
              type="checkbox"
              checked={this.state.approveSendingText}
              onChange={this.handleApproveSmsChange}
            />
            <p>
              A verified phone number is required to subscribe.  By checking this box, you agree to receive a confirmation code by SMS that you will have to enter to proceed.
            </p>
          </div>
        </div>

        {verificationCodeDisplay}
        {submitPersonalInformationDisplay}
        <ReactTooltip id="veh-per-info-tooltip" />
      </div>
    );
  }
}

VehiclePersonalInformationComponent.propTypes = {
  vehicle: VehicleType.isRequired,
  leadsData: PropTypes.shape({
    publicId: PropTypes.string.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  onSaving: PropTypes.func.isRequired
};

export default VehiclePersonalInformationComponent;
