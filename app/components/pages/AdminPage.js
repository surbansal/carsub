/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import Modal from 'react-modal';
import {Admin, fetchUtils, Resource} from 'react-admin';
import JssProvider from 'react-jss/lib/JssProvider';
import simpleRestProvider from 'ra-data-simple-rest';
import { createMuiTheme } from '@material-ui/core/styles';
import createHistory from 'history/createBrowserHistory';
import SubscriptionList from '../admin/SubscriptionList';
import VehicleList from '../admin/VehicleList';
import LeadsList from '../admin/LeadsList';
import SubscriptionView from '../admin/SubscriptionView';
import {Api} from '../../config/ApplicationContext';
import GenerateClassName from '../../config/JssClassGenerator';
import RequiresLogin from '../layout/RequiresLogin';
import './AdminPage.scss';
import VehicleView from '../admin/VehicleView';
import VehicleCreate from '../admin/VehicleCreate';
import LeadsView from '../admin/LeadsView';
import AreaList from '../admin/AreaList';
import AreaView from '../admin/AreaView';
import AdminModalService from '../../services/AdminModalService';
import AdminLayout from '../admin/AdminLayout';


class AdminPage extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    Modal.setAppElement('body');
    AdminModalService.onChange((content) => {
      this.setState({
        content
      });
    });
  }

  render() {
    const history = createHistory({
      basename: '/admin'
    });
    const myTheme = createMuiTheme({
      overrides: {
        MuiAppBar: {
          colorSecondary: {
            'background-color': '#2196f3',
          },
        },
        MuiTab: {
          root: {
            'min-width': '150px !important',
          },
        },
        MuiTabs: {
          fixed: {
            'overflow-x': 'auto',
          },
        },
      },
    });
    const httpClient = (url, options) => {
      return fetchUtils.fetchJson(url, {...options, credentials: 'include'});
    };

    const server = simpleRestProvider(Api.resolve('/admin'), httpClient);

    const style = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: '0px',
        transform: 'translate(-50%, -50%)'
      }
    };

    return (
      <RequiresLogin redirectTo="/login" requiredRole="ROLE_CSA_ADMIN" roleRedirect="/not-found" fullRefresh>
        <Fragment>
          <Modal isOpen={this.state.content != null} contentLabel="Are you sure?" style={style}>
            {this.state.content}
          </Modal>

          <JssProvider generateClassName={GenerateClassName}>
            <Admin appLayout={AdminLayout} history={history} title="AAA Car Subscription" dataProvider={server} theme={myTheme}>
              <Resource name="subscription" options={{ label: 'Subscriptions' }} list={SubscriptionList} show={SubscriptionView} />
              <Resource name="vehicle" options={{ label: 'Vehicles' }} create={VehicleCreate} list={VehicleList} show={VehicleView} />
              <Resource name="lead" options={{ label: 'Leads' }} list={LeadsList} show={LeadsView} />
              <Resource name="area" options={{ label: 'Areas' }} list={AreaList} show={AreaView} />
            </Admin>
          </JssProvider>
        </Fragment>
      </RequiresLogin>
    );
  }
}

export default AdminPage;
