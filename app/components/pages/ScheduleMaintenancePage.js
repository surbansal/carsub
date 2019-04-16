import React, {Component, Fragment} from 'react';
import {ContentfulService, segmentAnalytics} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import MarkdownContent from '../content/MarkdownContent';
import './ScheduleMaintenancePage.scss';
import LoadingIndicator from '../LoadingIndicator';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class ScheduleMaintenancePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntry('3TIXxAdooUYqSiweuyY6cq').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }

  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const smPage = this.state.content;
      Content = () => (
        <Fragment>
          <div className="scheduled-maintenance">
            <BreadcrumbComponent text="My Account" url="/my-account" />
            <div className="header-info">
              <h2 className="medium">{smPage.title}</h2>
            </div>
            <div>
              <MarkdownContent markdown={smPage.description} />
            </div>
            <div className="sm-contact">
              <MarkdownContent markdown={smPage.footerDescription} />
            </div>
          </div>
          <div className="button">
            <a className="mobile-only" href="tel:18003602228" onClick={() => segmentAnalytics.track('Phone number clicked', {category: 'Call for maintenance'})}>
              <button className="csa-button primary" onClick={() => segmentAnalytics.track('Call button clicked', {category: 'Call for maintenance'})}>Call to Schedule Maintenance</button>
            </a>
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

export default ScheduleMaintenancePage;
