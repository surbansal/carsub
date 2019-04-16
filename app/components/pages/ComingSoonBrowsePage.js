import React, {Component, Fragment} from 'react';
import {geocodeByAddress} from 'react-places-autocomplete';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import ZipCodeService from '../../services/api/ZipCodeService';
import './BrowseVehiclePage.scss';
import {Api, ContentfulService, segmentAnalytics} from '../../config/ApplicationContext';
import MarkdownContent from '../content/MarkdownContent';

class ComingSoonBrowsePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userContent: {},
      userEmail: '',
      contentSubmitted: false,
      zipServiceable: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
  }

  componentDidMount() {
    ZipCodeService.isZipCodeServiceable().then((zipServiceable) => {
      this.setState({zipServiceable});
      if (zipServiceable) {
        const existingZipCode = ZipCodeService.extractZipCode();
        if (existingZipCode) {
          geocodeByAddress(existingZipCode)
            .then((results) => {
              const selectedAddress = results[0];
              const location = selectedAddress.formatted_address.substring(0, selectedAddress.formatted_address.indexOf(existingZipCode));
              const {userContent} = this.state;
              userContent.header = `Coming soon to ${location}!`;
              userContent.instructions = 'We\'re launching in your area soon.<br/>Sign up below to be informed when we go live.';
              userContent.buttonText = 'Notify Me';
              userContent.successfulSubmitMessage = 'Thank you for your interest!  We\'ll be in touch.';
              this.setState({userContent});
            });
        }
      } else {
        ContentfulService.getEntry('1m5Ub6oUgEiekquoeiiUYO').then((resp) => {
          this.setState({
            userContent: resp.fields
          });
        });
      }
    });
  }

  handleEmailChange(e) {
    this.setState({
      userEmail: e.target.value
    });
  }

  submitEmail() {
    const interestedParty = {
      email: this.state.userEmail,
      zipCode: ZipCodeService.extractZipCode(),
      isServiceable: this.state.zipServiceable
    };
    Api.post('/parties', interestedParty).then(() => {
      segmentAnalytics.track('Submit Email', {
        category: 'Interested Party',
        label: `${interestedParty.email} | ${interestedParty.zipCode} | ${interestedParty.isServiceable}`
      });

      this.setState({
        contentSubmitted: true
      });
    });
  }

  render() {
    const content = this.state.userContent;
    let message = (
      <Fragment>
        <MarkdownContent markdown={content.instructions} />
        <div className="action-field">
          <input className="block large" type="text" placeholder="Email Address" value={this.state.userEmail} onChange={this.handleEmailChange} />
          <button onClick={this.submitEmail} className="csa-button primary">{content.buttonText}</button>
        </div>
      </Fragment>
    );
    if (this.state.contentSubmitted) {
      message = <MarkdownContent markdown={content.successfulSubmitMessage} />;
    }

    const areaDetailsHtml = <span>Vehicles unavailable</span>;

    const pageContent = (
      <div className="out-of-area messaging-page">
        <div className="header-info">
          <h1>{content.header}</h1>
        </div>
        <div className="messaging-content">
          {message}
        </div>
      </div>
    );

    return (
      <HeaderAndFooterPage>
        <Fragment>
          <div className="search-bar">
            <div className="search-area">
              <div className="area-details">
                {areaDetailsHtml}
              </div>
              <div className="number-of-results">
                0 results
              </div>

              <div className="line-gradient" />
            </div>
          </div>
          {pageContent}
        </Fragment>
      </HeaderAndFooterPage>
    );
  }
}

export default ComingSoonBrowsePage;
