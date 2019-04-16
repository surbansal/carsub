import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import {Api} from '../../config/ApplicationContext';
import './EmailConfirmationPage.scss';
import emailIcon from '../../assets/images/email-icon.png';

class EmailConfirmationPage extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    this.state = {
      subscriptionId: params.get('subscription'),
      emailVerificationCode: params.get('email-verification'),
      verificationCode: params.get('verification'),
      email: params.get('email'),
      emailToVerify: params.get('email'),
      editingEmail: false,
      isSuccess: false,
      isFailure: false,
      failureMessage: '',
      loading: false,
      errors: {
        email: false,
        emailMessage: ''
      }
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.resendVerificationMail = this.resendVerificationMail.bind(this);
    this.editEmail = this.editEmail.bind(this);
  }

  componentDidMount() {
    Api.get(`/subscription?id=${this.state.subscriptionId}&verification=${this.state.verificationCode}`).then((response) => {
      if (response.isEmailConfirmed) {
        this.props.history.push({
          pathname: '/confirmation',
          search: `subscription=${this.state.subscriptionId}&verification=${this.state.verificationCode}`
        });
      }
    });
  }

  handleEmailChange(e) {
    const email = e.target.value;
    const errorsTemp = this.state.errors;
    errorsTemp.email = false;
    errorsTemp.emailMessage = '';
    this.setState({
      email,
      isSuccess: false,
      isFailure: false,
      errors: errorsTemp
    });
  }

  editEmail() {
    this.setState({
      editingEmail: true
    });
  }

  resendVerificationMail() {
    this.setState({
      loading: true
    });
    const requestBody = {
      subscriptionId: this.state.subscriptionId,
      email: this.state.email,
      emailVerificationCode: this.state.emailVerificationCode
    };
    Api.post('/subscription/resendVerification/email', requestBody).then((response) => {
      this.setState({
        emailToVerify: requestBody.email,
        emailVerificationCode: response.emailVerificationToken,
        isSuccess: true,
        isFailure: false,
        loading: false
      });
      this.props.history.push({
        pathname: '/confirm-email',
        search: `subscription=${this.state.subscriptionId}&verification=${this.state.verificationCode}&email-verification=${this.state.emailVerificationCode}&email=${this.state.email}`
      });
    }).catch((errorData) => {
      errorData.json().then((data) => {
        if (data.validationErrors) {
          data.validationErrors.forEach((field) => {
            const errorsTemp = this.state.errors;
            errorsTemp[field.property] = true;
            const errorMessage = `${field.property}Message`;
            errorsTemp[errorMessage] = field.message;
            this.setState({
              errors: errorsTemp,
              isSuccess: false,
              isFailure: true,
              loading: false
            });
          });
        } else {
          this.setState({
            isSuccess: false,
            isFailure: true,
            failureMessage: data.message,
            loading: false
          });
        }
      });
    });
  }

  render() {
    const successMessage = this.state.isSuccess ?
      (<p className="success-message">Email successfully resent</p>) : null;
    const failureMessage = this.state.isFailure ?
      (<p className="error-message">{this.state.failureMessage}</p>) : null;
    return (
      <HeaderAndFooterPage>
        <div className="verify-email">
          <div className="title"><h2>Check your email</h2></div>
          <div className="description">
            <p>Click the link in the email we sent to {this.state.emailToVerify}.<br />
              Confirming your email address helps us notify you when your car is on the way.
            </p>
          </div>
          <div className="email-info">
            <div className="email-icon">
              <img src={emailIcon} alt="Email Icon" />
            </div>
            {!this.state.editingEmail ? (
              <h3>{this.state.email}</h3>
            ) : (
              <div>
                <input type="text" className={ this.state.errors.email ? 'block error' : 'block'} value={this.state.email} onChange={this.handleEmailChange} />
                <p className={ this.state.errors.email ? 'error-message' : 'hide-error'}>{ this.state.errors.emailMessage }</p>
              </div>
            )}
            <button className="csa-button primary" onClick={this.resendVerificationMail} disabled={this.state.loading}>Send Email Again</button>
            {successMessage}
            {failureMessage}
            <button className="link-button" onClick={this.editEmail}>Change email address</button>
          </div>
          <div className="questions-section">
            <div className="having-trouble">
              <h2>Having trouble? </h2><p> See <Link to="/faqs">FAQs</Link></p>
            </div>
            <div className="questions">
              <h2>Questions? Email us at </h2><p><a href="mailto:carsubscription@norcal.aaa.com">carsubscription@norcal.aaa.com</a></p>
            </div>
          </div>
        </div>
      </HeaderAndFooterPage>
    );
  }
}
EmailConfirmationPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(EmailConfirmationPage);
