import React, {Component, Fragment} from 'react';
import './RoadsideAssistancePage.scss';
import {ContentfulService, segmentAnalytics} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import MarkdownContent from '../content/MarkdownContent';
import LoadingIndicator from '../LoadingIndicator';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';
import DeviceTypeContext from '../../contexts/DeviceTypeContext';

class RoadsideAssistancePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntry('2v93WsF0ugkeisYe2CgQWa').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }
  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const rsaPage = this.state.content;
      Content = () => (
        <Fragment>
          <div className="roadside-assist">
            <BreadcrumbComponent text="My Account" url="/my-account" />
            <div className="header-info">
              <h2 className="medium">{rsaPage.title}</h2>
            </div>
            <div>
              <MarkdownContent markdown={rsaPage.description} />
            </div>
          </div>
          <div className="button">
            <a className="mobile-only" href="tel:18003602228" onClick={() => segmentAnalytics.track('Phone number clicked', {category: 'Roadside assistance call'})}>
              <button className="csa-button primary" onClick={() => segmentAnalytics.track('Call button clicked', {category: 'Roadside assistance call'})}>Call for Roadside Assistance</button>
            </a>
          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <MyAccountHeaderAndFooterPage activeFooterLink="emergencyAssist">
          <Content />
        </MyAccountHeaderAndFooterPage>
      </Fragment>
    );
  }
}

RoadsideAssistancePage.contextType = DeviceTypeContext;

export default RoadsideAssistancePage;
