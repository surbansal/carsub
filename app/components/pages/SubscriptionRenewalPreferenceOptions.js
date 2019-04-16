import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Api, ContentfulService, segmentAnalytics} from '../../config/ApplicationContext';
import LoadingIndicator from '../LoadingIndicator';
import BreadcrumbComponent from '../BreadcrumbComponent';
import MarkdownContent from '../content/MarkdownContent';
import './SubscriptionRenewalPreferenceOptions.scss';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class SubscriptionRenewalPreferenceOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      renewalOptions: [],
      selectedRenewalOption: null,
      subscriptionId: null,
      errors: {
        preferenceSubmitError: false,
        preferenceSubmitErrorMessage: '',
      },
    };
    this.selectOption = this.selectOption.bind(this);
    this.submitOption = this.submitOption.bind(this);
  }
  componentDidMount() {
    const contentfulId = '4xNOteUHh6AcugMgWk2Wqi';
    ContentfulService.getEntries({'sys.id': contentfulId, include: 5}).then((resp) => {
      this.setState({
        content: resp,
        renewalOptions: resp.items[0].fields.options
      });
    });
    Api.get('/subscription/current').then((response) => {
      this.setState({
        subscriptionId: `${response.id}`,
      });
    });
  }

  selectOption(e) {
    const {errors} = this.state;
    errors.preferenceSubmitError = false;
    this.setState({
      errors,
      selectedRenewalOption: e.currentTarget.id,
    });
  }

  submitOption() {
    const {errors} = this.state;
    errors.preferenceSubmitError = false;
    if (this.state.selectedRenewalOption && this.state.subscriptionId) {
      const request = {
        subscriptionId: this.state.subscriptionId,
        renewalPreference: this.state.selectedRenewalOption
      };
      segmentAnalytics.track('Renewal Preference', { category: 'Notifications', label: this.state.selectedRenewalOption});
      Api.post('/subscription/renewal-preference', request).then(() => {
        this.props.history.push({
          pathname: '/renewal-confirmation',
        });
      }).catch((response) => {
        if (response.status !== undefined) {
          response.json().then((data) => {
            errors.preferenceSubmitError = true;
            errors.preferenceSubmitErrorMessage = data.validationErrors[0].message;
            this.setState({
              errors
            });
          });
        }
      });
    } else if (!this.state.selectedRenewalOption) {
      errors.preferenceSubmitError = true;
      errors.preferenceSubmitErrorMessage = 'Please Select a Preference';
      this.setState({
        errors
      });
    }
  }

  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const subscriptionRenewalOptionsContent = this.state.content.items;
      Content = () => (
        <Fragment>
          <div className="renewal-preferences">
            <BreadcrumbComponent text="My Account" url="/my-account" />
            <div className="header-info">
              <h2 className="medium">{subscriptionRenewalOptionsContent[0].fields.title}</h2>
            </div>
            <div className="description mobile-font-small">
              <MarkdownContent markdown={subscriptionRenewalOptionsContent[0].fields.description} />
            </div>
            <div className="renewal-options mobile-font-small">
              {this.state.renewalOptions.map((option) => {
              const imageFields = option.fields.image.fields;
              return (
                <div key={option.fields.title} id={imageFields.title} className={this.state.selectedRenewalOption === `${imageFields.title}` ? `renewal-option ${imageFields.title} selected-option` : `renewal-option ${imageFields.title}`} role="presentation" onClick={this.selectOption} onKeyDown={this.selectOption}>
                  <div className="icon-container">
                    <img src={imageFields.file.url} alt={imageFields.title} />
                  </div>
                  <div className="icon-text">
                    <span className="heading medium">{option.fields.title}</span>
                    <span className="heading ">{option.fields.description}</span>
                  </div>
                </div>
              );
            })
            }
            </div>
            <p className={ this.state.errors.preferenceSubmitError ? 'error-message' : 'hide-error'}>{ this.state.errors.preferenceSubmitErrorMessage }</p>
            <button className="csa-button primary mobile-font-small" onClick={this.submitOption}>Select</button>
          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <MyAccountHeaderAndFooterPage>
          <Content />
        </MyAccountHeaderAndFooterPage>
      </Fragment>
    );
  }
}

SubscriptionRenewalPreferenceOptions.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default SubscriptionRenewalPreferenceOptions;
