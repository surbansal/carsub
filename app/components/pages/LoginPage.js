import React, {Component, Fragment} from 'react';
import {withRouter, Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './LoginPage.scss';
import PasswordEntryComponent from '../accounts/PasswordEntryComponent';
import {userService, segmentAnalytics} from '../../config/ApplicationContext';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {
        username: false,
        usernameMessage: '',
        password: false,
        passwordMessage: '',
        loginFailed: false
      }
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleForgotPasswordClick = this.handleForgotPasswordClick.bind(this);
    this.clearFormErrors = this.clearFormErrors.bind(this);
    this.validateFields = this.validateFields.bind(this);
  }

  componentDidMount() {
    this.navigateLoggedInUser();
  }

  onPasswordChange(changedPassword) {
    const {errors} = this.state;
    errors.password = false;
    errors.passwordMessage = '';
    this.setState({
      password: changedPassword,
      errors
    });
  }
  handleUsernameChange(e) {
    const {errors} = this.state;
    errors.username = false;
    errors.usernameMessage = '';
    this.setState({
      username: e.target.value,
      errors
    });
  }

  navigateLoggedInUser() {
    userService.getLoggedInUser().then((user) => {
      if (user === null) {
        return;
      }
      segmentAnalytics.identifyUser(user.id, {
        email: user.email
      });
      if (user.hasRole('ROLE_CSA_ADMIN')) {
        window.location.href = `${window.location.origin}/admin`;
      } else {
        this.props.history.push({
          pathname: '/my-account'
        });
      }
    });
  }

  handleLoginClick(e) {
    e.preventDefault();
    segmentAnalytics.track('Login button clicked', {category: 'Login Attempted'});
    if (this.validateFields()) {
      userService.login(this.state.username, this.state.password).then(() => {
        this.clearFormErrors();
        this.navigateLoggedInUser();
      }).catch((response) => {
        response.json().then((data) => {
          if (data.status === 'Authentication failure') {
            const {errors} = this.state;
            errors.loginFailed = true;
            errors.username = true;
            errors.password = true;
            this.setState({
              errors
            });
          }
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
    if (this.state.password.trim() === '') {
      errors.password = true;
      errors.passwordMessage = 'Password cannot be empty';
      isValid = false;
    }
    this.setState({errors});
    return isValid;
  }

  clearFormErrors() {
    const {errors} = this.state;
    errors.username = false;
    errors.password = false;
    errors.usernameMessage = '';
    errors.passwordMessage = '';
    errors.loginFailed = false;
  }

  handleForgotPasswordClick() {
    this.setState({});
  }

  render() {
    const loginErrorHtml = this.state.errors.loginFailed ? (
      <p className="error-message">We could not find your account with the supplied username and password.</p>
    ) :
      '';

    return (
      <HeaderAndFooterPage className="login-page">
        <Fragment>
          <form onSubmit={this.handleLoginClick}>
            <h2 className="heading">
              Login to Car Subscription.
            </h2>
            {loginErrorHtml}
            <div className="action-field">
              <label htmlFor="username">Username (Email)</label>
              <input id="username" name="username" type="text" className={ this.state.errors.username ? 'error' : ''} value={this.state.username} onChange={this.handleUsernameChange} />
              <p className={ this.state.errors.username ? 'error-message' : 'hide-error'}>{this.state.errors.usernameMessage}</p>
            </div>
            <div className="action-field">
              <PasswordEntryComponent isError={this.state.errors.password} sendData={ (val) => { this.onPasswordChange(val); } } />
              <p className={ this.state.errors.password ? 'error-message' : 'hide-error'}>{this.state.errors.passwordMessage}</p>
            </div>
            <div className="action-field">
              <button className="csa-button primary" type="submit">Login</button>
            </div>
            <div className="action-field forgot-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </form>
        </Fragment>
      </HeaderAndFooterPage>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(LoginPage);
