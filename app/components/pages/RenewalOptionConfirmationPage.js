import React, {Component, Fragment} from 'react';
import LoadingIndicator from '../LoadingIndicator';
import {ContentfulService} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import MarkdownContent from '../content/MarkdownContent';
import './RenewalOptionConfirmationPage.scss';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class RenewalOptionConfirmationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntry('i6q2Cv28BGuAMoW8MqkeA').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }

  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const rocPage = this.state.content;
      Content = () => (
        <Fragment>
          <div className="renew-confirm-content">
            <BreadcrumbComponent text="My Account" url="/my-account" />
            <div className="header-info">
              <h2 className="medium">{rocPage.title}</h2>
            </div>
            <div>
              <MarkdownContent markdown={rocPage.description} />
            </div>
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

export default RenewalOptionConfirmationPage;
