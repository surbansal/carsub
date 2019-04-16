import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './LoginPage.scss';
import PasswordEntryComponent from '../accounts/PasswordEntryComponent';
import {Api} from '../../config/ApplicationContext';

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    this.state = {
      resetPassword: {
        id: params.get('id'),
        token: params.get('token'),
        password: ''
      },
      errors: {
        password: false,
        passwordMessage: ''
      }
    };
    this.handleResetPasswordClick = this.handleResetPasswordClick.bind(this);
    this.clearFormErrors = this.clearFormErrors.bind(this);
  }
  onPasswordChange(changedPassword) {
    const tempState = this.state;
    tempState.resetPassword.password = changedPassword;
    tempState.errors.password = false;
    tempState.errors.passwordMessage = '';
    this.setState(tempState);
  }

  clearFormErrors() {
    const {errors} = this.state;
    errors.password = false;
    errors.passwordMessage = '';
  }
  handleResetPasswordClick(e) {
    e.preventDefault();

    Api.post('/password/reset', this.state.resetPassword).then(() => {
      this.props.history.push({
        pathname: '/login'
      });
    }).catch((response) => {
      response.json().then((data) => {
        const {errors} = this.state;
        errors.password = true;
        errors.passwordMessage = data.validationErrors[0].message;
        this.setState({
          errors
        });
      });
    });
  }
  render() {
    return (
      <HeaderAndFooterPage className="reset-password-page">
        <Fragment>
          <form onSubmit={this.handleResetPasswordClick}>
            <h2 className="heading">
            Please reset your password for Car Subscription Application account below.
            </h2>

            <div className="action-field">
              <PasswordEntryComponent errorMessage={this.state.errors.passwordMessage} isError={this.state.errors.password} sendData={ (val) => { this.onPasswordChange(val); } } />
            </div>
            <div className="action-field forgot-link">
              <button className="csa-button primary" type="submit">Reset Password</button>
            </div>
          </form>
        </Fragment>
      </HeaderAndFooterPage>
    );
  }
}

ResetPasswordPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};
export default ResetPasswordPage;
