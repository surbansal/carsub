import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './LoginPage.scss';
import PasswordEntryComponent from '../accounts/PasswordEntryComponent';
import {Api, userService, segmentAnalytics} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';

class ChangePasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changePassword: {
        password: '',
        existingPassword: ''
      },
      errors: {
        password: false,
        passwordMessage: '',
        existingPassword: false,
        existingPasswordMessage: '',
        changePasswordFailed: false,
        changePasswordFailedMessage: ''
      }
    };
    this.handleChangePasswordClick = this.handleChangePasswordClick.bind(this);
    this.clearFormErrors = this.clearFormErrors.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }
  onPasswordChange(changedPassword) {
    const tempState = this.state;
    tempState.changePassword.password = changedPassword;
    tempState.errors.password = false;
    tempState.errors.passwordMessage = '';
    this.setState(tempState);
  }
  onExistingPasswordChange(changedPassword) {
    const tempState = this.state;
    tempState.changePassword.existingPassword = changedPassword;
    tempState.errors.existingPassword = false;
    tempState.errors.existingPasswordMessage = '';
    this.setState(tempState);
  }
  validateFields() {
    const {errors} = this.state;
    let isValid = true;
    if (this.state.changePassword.password.trim() === '') {
      errors.password = true;
      errors.passwordMessage = 'Current Password cannot be empty';
      isValid = false;
    }
    if (this.state.changePassword.existingPassword.trim() === '') {
      errors.existingPassword = true;
      errors.existingPasswordMessage = 'Existing Password cannot be empty';
      isValid = false;
    }
    this.setState({errors});
    return isValid;
  }

  clearFormErrors() {
    const {errors} = this.state;
    errors.password = false;
    errors.passwordMessage = '';
    errors.changePasswordFailed = false;
    errors.changePasswordFailedMessage = '';
  }
  handleChangePasswordClick() {
    if (this.validateFields()) {
      this.clearFormErrors();
      Api.post('/password/change', this.state.changePassword).then(() => {
        segmentAnalytics.track('Password changed', {category: 'Changes Password'});
        userService.getLoggedInUser().then((user) => {
          let location = '/my-account';
          if (user && user.hasRole('ROLE_CSA_ADMIN')) {
            location = '/admin';
          }
          this.props.history.push({
            pathname: location
          });
        });
      }).catch((response) => {
        response.json().then((data) => {
          const {errors} = this.state;
          errors.changePasswordFailed = true;
          errors.changePasswordFailedMessage = data.validationErrors[0].message;
          this.setState({
            errors
          });
        });
      });
    }
  }
  render() {
    const changePasswordErrorHtml = this.state.errors.changePasswordFailed ? (
      <p className="error-message">{this.state.errors.changePasswordFailedMessage}</p>
    ) : '';
    return (
      <HeaderAndFooterPage className="reset-password-page">
        <Fragment>
          <BreadcrumbComponent text="My Account" url="/my-account" />
          <div>
            <h2 className="heading">
            Please change your password for Car Subscription Application account below.
            </h2>
            {changePasswordErrorHtml}
            <div className="action-field">
              <PasswordEntryComponent label="Existing Password" isError={this.state.errors.existingPassword} sendData={ (val) => { this.onExistingPasswordChange(val); } } />
              <p className={ this.state.errors.existingPassword ? 'error-message' : 'hide-error'}>{this.state.errors.existingPasswordMessage}</p>
            </div>
            <div className="action-field">
              <PasswordEntryComponent label="New Password" isError={this.state.errors.password} sendData={ (val) => { this.onPasswordChange(val); } } />
              <p className={ this.state.errors.password ? 'error-message' : 'hide-error'}>{this.state.errors.passwordMessage}</p>
            </div>
            <div className="action-field forgot-link">
              <button className="csa-button primary" type="button" onClick={this.handleChangePasswordClick}>Change Password</button>
            </div>
          </div>
        </Fragment>
      </HeaderAndFooterPage>
    );
  }
}

ChangePasswordPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};
export default ChangePasswordPage;
