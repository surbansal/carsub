import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Api} from '../../config/ApplicationContext';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';

class EmailVerificationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      errorMessage: ''
    };
  }
  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const request = {
      subscriptionId: params.get('subscription'),
      emailVerificationCode: params.get('verification'),
      email: params.get('email')
    };
    Api.post('/subscription/verify/email', request).then((response) => {
      this.setState({isError: false});
      this.props.history.push({
        pathname: '/confirmation',
        search: `subscription=${response.publicId}&verification=${response.verificationToken}`
      });
    }).catch((errorData) => {
      errorData.json().then((data) => {
        if (data.validationErrors) {
          let errorMessage;
          data.validationErrors.forEach((field) => {
            errorMessage = (errorMessage) ? `${errorMessage}${field.message} \n ` : `${field.message} \n `;
          });
          this.setState({
            isError: true,
            errorMessage
          });
        }
      });
    });
  }

  render() {
    const invalidLinkError = this.state.isError ? (
      <p className="error-message">{this.state.errorMessage}</p>
    ) : null;
    return (
      <HeaderAndFooterPage>
        <div>
          {invalidLinkError}
        </div>
      </HeaderAndFooterPage>
    );
  }
}

EmailVerificationPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(EmailVerificationPage);
