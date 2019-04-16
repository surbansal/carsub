import React, {Component, Fragment} from 'react';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './LoginPage.scss';
import {Api, segmentAnalytics} from '../../config/ApplicationContext';

class ForgotPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      isSuccess: false,
      errors: {
        username: false,
        usernameMessage: '',
        forgotPasswordFailed: false,
        forgotPasswordFailedMsg: ''
      }
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleResetPasswordClick = this.handleResetPasswordClick.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  handleUsernameChange(e) {
    const errorsTemp = this.state.errors;
    errorsTemp.username = false;
    errorsTemp.usernameMessage = '';
    this.setState({
      username: e.target.value,
      errors: errorsTemp
    });
  }

  handleResetPasswordClick(e) {
    e.preventDefault();
    segmentAnalytics.track('Reset password clicked', {category: 'Reset Password Attempted'});
    if (this.validateFields()) {
      const reqBody = {
        email: this.state.username
      };
      this.clearForm();
      Api.post('/password/generate-link', reqBody).then(() => {
        const tempState = this.state;
        tempState.isSuccess = true;
        this.setState(tempState);
      }).catch((response) => {
        response.json().then(() => {
          const {errors} = this.state;
          errors.forgotPasswordFailed = true;
          errors.forgotPasswordFailedMsg = 'There was an error looking up your email address';
          this.setState({
            errors
          });
        });
      });
    }
  }
  validateFields() {
    const {errors} = this.state;
    let isValid = true;
    if (this.state.username.trim() === '') {
      errors.username = true;
      errors.usernameMessage = 'Username cannot be empty';
      isValid = false;
    }
    this.setState({errors});
    return isValid;
  }
  clearForm() {
    const tempState = this.state;
    tempState.errors.username = false;
    tempState.errors.usernameMessage = '';
    tempState.errors.forgotPasswordFailed = false;
    tempState.errors.forgotPasswordFailedMsg = '';
    tempState.isSuccess = false;
    this.setState(tempState);
  }
  render() {
    const forgotPasswordErrorHtml = this.state.errors.forgotPasswordFailed ? (
      <p className="error-message">{this.state.errors.forgotPasswordFailedMsg}</p>
    ) :
      '';
    const forgotPasswordSuccessHtml = this.state.isSuccess ? (
      <p className="success-message">A password reset link will be sent to the email provided if it was found in our system.</p>
    ) :
      '';
    return (
      <HeaderAndFooterPage className="forgot-password-page">
        <Fragment>
          <form onSubmit={this.handleResetPasswordClick}>
            <h2 className="heading">
            Please enter your email address to reset your password.
            </h2>
            {forgotPasswordErrorHtml}
            {forgotPasswordSuccessHtml}
            <div className="action-field">
              <label htmlFor="username">Username (Email)</label>
              <input id="username" type="text" className={ this.state.errors.username ? 'error' : ''} value={this.state.username} onChange={this.handleUsernameChange} />
              <p className={ this.state.errors.username ? 'error-message' : 'hide-error'}>{this.state.errors.usernameMessage}</p>
            </div>
            <div className="action-field forgot-link">
              <button className="csa-button primary" type="submit" disabled={this.state.isSuccess}>Reset Password</button>
            </div>
          </form>
        </Fragment>
      </HeaderAndFooterPage>
    );
  }
}


export default ForgotPasswordPage;
