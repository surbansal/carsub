import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import LearnMore from '../static/LearnMore';
import './MessagingPage.scss';

class NotFoundPage extends Component {
  render() {
    return (
      <HeaderAndFooterPage>
        <div className="messaging-page">
          <div className="header-info">
            <h1>Sorry, the page you&#39;re looking for could not be found.</h1>
          </div>
          <div className="messaging-content">
            It looks like you found a page that has been moved or is no longer here.  To get back on the right track, <Link to="/">Click here</Link> to continue navigating AAA Car Subscription.
          </div>
          <div className="line" />
          <LearnMore />
        </div>
      </HeaderAndFooterPage>
    );
  }
}

export default NotFoundPage;
