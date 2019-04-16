import React, {Component, Fragment} from 'react';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import LearnMore from '../static/LearnMore';
import './MessagingPage.scss';
import './OutOfAreaPage.scss';
import {ContentfulService, Api} from '../../config/ApplicationContext';
import MarkdownContent from '../content/MarkdownContent';
import ZipCodeService from '../../services/api/ZipCodeService';

class OutOfAreaPage extends Component {
  constructor() {
    super();
    this.state = {
      content: {},
      email: '',
      submitted: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
  }

  componentDidMount() {
    ContentfulService.getEntry('1m5Ub6oUgEiekquoeiiUYO').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  submitEmail() {
    const interestedParty = {
      email: this.state.email,
      zipCode: ZipCodeService.extractZipCode()
    };
    Api.post('/parties', interestedParty).then(() => {
      this.setState({
        submitted: true
      });
    });
  }

  render() {
    const outOfAreaPage = this.state.content;
    let message = (
      <Fragment>
        <MarkdownContent markdown={outOfAreaPage.instructions} />
        <div className="action-field">
          <input className="block large" type="text" placeholder="Email Address" value={this.state.email} onChange={this.handleEmailChange} />
          <button onClick={this.submitEmail} className="csa-button primary">{outOfAreaPage.buttonText}</button>
        </div>
      </Fragment>
    );
    if (this.state.submitted) {
      message = <MarkdownContent markdown={outOfAreaPage.successfulSubmitMessage} />;
    }
    return (
      <HeaderAndFooterPage>
        <div className="out-of-area messaging-page">
          <div className="header-info">
            <h1>{outOfAreaPage.header}</h1>
          </div>
          <div className="messaging-content">
            {message}
          </div>
          <div className="line" />
          <LearnMore />
        </div>
      </HeaderAndFooterPage>
    );
  }
}

export default OutOfAreaPage;
