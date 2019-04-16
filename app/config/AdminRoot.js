import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Notifications from 'react-notify-toast';
import AdminPage from '../components/pages/AdminPage';
import withAnalytics from './withAnalytics';
import scrollToTop from './scrollToTop';

class AdminRoot extends Component {
  render() {
    const notificationOptions = {
      zIndex: 200, top: '5px', timeout: 5000
    };

    return (
      <Fragment>
        <Notifications options={notificationOptions} />
        <Router>
          <Switch>
            <Route path="/admin" component={scrollToTop(withAnalytics(AdminPage))} />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}

export default AdminRoot;
