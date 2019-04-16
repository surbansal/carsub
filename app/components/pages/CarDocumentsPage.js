import React, {Component, Fragment} from 'react';
import './CarDocumentsPage.scss';
import {Api, ContentfulService, segmentAnalytics} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import MarkdownContent from '../content/MarkdownContent';
import LoadingIndicator from '../LoadingIndicator';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';
import DeviceTypeContext from '../../contexts/DeviceTypeContext';

class CarDocumentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      contractDownloadLocation: '',
      carInspectionDownloadLocation: '',
    };
    this.populateDocumentLinks = this.populateDocumentLinks.bind(this);
  }

  componentDidMount() {
    ContentfulService.getEntry('5Wz61sl5y8kMYM4Kcc48mU').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
    this.populateDocumentLinks();
  }

  populateDocumentLinks() {
    Api.get('/subscription/current/contract').then((response) => {
      this.setState({
        contractDownloadLocation: response.location
      });
    });
    Api.get('/subscription/renewed/contract').then((response) => {
      this.setState({
        renewalContractDownloadLocation: response.location
      });
    });
    Api.get('/subscription/current/carinspection').then((response) => {
      this.setState({
        carInspectionDownloadLocation: response.location
      });
    });
  }

  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const carDocumentsPage = this.state.content;
      const contractLink = this.state.contractDownloadLocation;
      const carInspectionLink = this.state.carInspectionDownloadLocation;
      const renewalContractLink = this.state.renewalContractDownloadLocation;
      Content = () => (
        <DeviceTypeContext.Consumer>
          {deviceContext => deviceContext.isMobile &&
            <Fragment>
              <div className="car-docs">
                <BreadcrumbComponent text="My Account" url="/my-account" />
                <div className="header-info">
                  <h2 className="medium">{carDocumentsPage.title}</h2>
                </div>
                <div>
                  <MarkdownContent markdown={carDocumentsPage.description} />
                </div>
              </div>
              <div>
                <div className="doc-links">
                  {contractLink &&
                  <a href={contractLink} onClick={() => segmentAnalytics.track('Contract viewed', {category: 'Car Documents interaction'})} target="_blank">{carDocumentsPage.contractLinkText}</a>
                  }
                  {renewalContractLink &&
                  <a href={renewalContractLink} onClick={() => segmentAnalytics.track('Renewal Contract viewed', {category: 'Car Documents interaction'})} target="_blank">{carDocumentsPage.renewalContractLinkText}</a>
                  }
                  {carInspectionLink &&
                  <a href={carInspectionLink} onClick={() => segmentAnalytics.track('Inspection Report viewed', {category: 'Car Documents interaction'})} target="_blank">{carDocumentsPage.inspectionReportLinkText}</a>
                  }
                </div>
              </div>
            </Fragment>
          }
        </DeviceTypeContext.Consumer>
      );
    }
    return (
      <Fragment>
        <MyAccountHeaderAndFooterPage activeFooterLink="carDocument">
          <Content />
        </MyAccountHeaderAndFooterPage>
      </Fragment>
    );
  }
}

CarDocumentsPage.contextType = DeviceTypeContext;

export default CarDocumentsPage;
