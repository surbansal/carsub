import React, {Component, Fragment} from 'react';
import {ContentfulService, segmentAnalytics} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import MarkdownContent from '../content/MarkdownContent';
import './AccidentInstructionsPage.scss';
import LoadingIndicator from '../LoadingIndicator';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class AccidentInstructionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntry('6pAwCfBKxOuQ4sy0Y0M0Ae').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }

  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const accidentInstructionsPage = this.state.content;
      Content = () => (
        <Fragment>
          <div className="accident-instructions">
            <BreadcrumbComponent text="My Account" url="/my-account" />
            <div className="header-info">
              <h2 className="medium">{accidentInstructionsPage.title}</h2>
            </div>
            <div>
              <MarkdownContent markdown={accidentInstructionsPage.description} />
            </div>
            <div className="accident-Instructions-contact">
              <MarkdownContent markdown={accidentInstructionsPage.footerDescription} />
            </div>
          </div>
          <div className="button">
            <a className="mobile-only" href="tel:18003602228" onClick={() => segmentAnalytics.track('Phone number clicked', {category: 'Call for accident'})}>
              <button className="csa-button primary" onClick={() => segmentAnalytics.track('Call button clicked', {category: 'Call for accident'})}>Call for Accident Instructions</button>
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

export default AccidentInstructionsPage;
