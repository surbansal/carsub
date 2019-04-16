import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import {Api} from '../config/ApplicationContext';
import './SecondaryAuthWrapper.scss';
import LoadingIndicator from './LoadingIndicator';

class SecondaryAuthWrapper extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.state = {
      authenticated: false,
      password: '',
      error: false,
    };
  }

  componentWillMount() {
    const alreadySet = cookie.load('secondary-auth-password');
    if (alreadySet) {
      this.setState({
        password: alreadySet
      }, this.login);
    }
  }

  async login() {
    this.setState({
      error: false,
      loading: true,
    });
    try {
      await Api.post(`/auth/secondary/${this.state.password}`);
      cookie.save('secondary-auth-password', this.state.password);
      this.setState({
        authenticated: true
      });
    } catch (e) {
      this.setState({
        error: true
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  render() {
    if (this.state.authenticated || !this.props.enabled) {
      return (
        <Fragment>
          {this.props.children}
        </Fragment>
      );
    }
    if (this.state.loading) {
      return <LoadingIndicator />;
    }
    return (
      <div className="secondary-auth-page">
        <div className="secondary-auth-form">
          <h1>Enter Password</h1>
          <div>This is not a publicly accessible site.  If you got here by mistake, please <a href="https://carsubscription.calstate.aaa.com/">click here</a> to access AAA Car Subscription.  Otherwise, enter the password to continue on.</div>
          <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          <button className="csa-button primary" onClick={this.login}>Enter</button>
          {this.state.error && <span className="error-message">Password was incorrect</span>}
        </div>
      </div>
    );
  }
}

SecondaryAuthWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  enabled: PropTypes.bool.isRequired,
};

export default SecondaryAuthWrapper;
