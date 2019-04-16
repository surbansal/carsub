import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Notifications from 'react-notify-toast';
import { LastLocationProvider } from 'react-router-last-location';
import BrowseVehiclePage from '../components/pages/BrowseVehiclePage';
import HomePage from '../components/pages/HomePage';
import VehicleDetailPage from '../components/pages/VehicleDetailPage';
import OutOfAreaPage from '../components/pages/OutOfAreaPage';
import AboutUsPage from '../components/pages/AboutUsPage';
import FaqsPage from '../components/pages/FaqsPage';
import ZipgateWrapper from '../components/ZipgateWrapper';
import TermsAndConditionsPage from '../components/pages/TermsAndConditionsPage';
import PrivacyPolicyPage from '../components/pages/PrivacyPolicyPage';
import CookieStatementPage from '../components/pages/CookieStatementPage';
import ContactUsPage from '../components/pages/ContactUsPage';
import SubscriptionConfirmationPage from '../components/pages/SubscriptionConfirmationPage';
import SubscriptionApprovalPage from '../components/pages/SubscriptionApprovalPage';
import LoginPage from '../components/pages/LoginPage';
import ForgotPasswordPage from '../components/pages/ForgotPasswordPage';
import ResetPasswordPage from '../components/pages/ResetPasswordPage';
import MyAccountPage from '../components/pages/MyAccountPage';
import ChangePasswordPage from '../components/pages/ChangePasswordPage';
import NotFoundPage from '../components/pages/NotFoundPage';
import RoadsideAssistancePage from '../components/pages/RoadsideAssistancePage';
import CarDocumentsPage from '../components/pages/CarDocumentsPage';
import EmailVerificationPage from '../components/pages/EmailVerificationPage';
import EmailConfirmationPage from '../components/pages/EmailConfirmationPage';
import ScheduleMaintenancePage from '../components/pages/ScheduleMaintenancePage';
import AccidentInstructionsPage from '../components/pages/AccidentInstructionsPage';
import AddNewPaymentMethodPage from '../components/pages/AddNewPaymentMethodPage';
import ManagePaymentPage from '../components/pages/ManagePaymentPage';
import ChangeDefaultPaymentMethod from '../components/pages/ChangeDefaultPaymentMethod';
import UnderMaintenancePage from '../components/pages/UnderMaintenancePage';
import ComingSoonBrowsePage from '../components/pages/ComingSoonBrowsePage';
import {Api} from './ApplicationContext';
import SubscriptionCompletionPage from '../components/pages/SubscriptionCompletionPage';
import withAnalytics from './withAnalytics';
import scrollToTop from './scrollToTop';
import LoadingIndicator from '../components/LoadingIndicator';
import AddOnsPage from '../components/pages/AddOnsPage';
import SubscriptionDetailsPage from '../components/pages/SubscriptionDetailsPage';
import SubscriptionRenewalPreferenceOptions from '../components/pages/SubscriptionRenewalPreferenceOptions';
import '../assets/sitemap.xml';
import RenewalOptionConfirmationPage from '../components/pages/RenewalOptionConfirmationPage';
import LayoutService from '../services/api/LayoutService';
import DeviceTypeContext from '../contexts/DeviceTypeContext';
import SecondaryAuthWrapper from '../components/SecondaryAuthWrapper';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      underMaintenancePages: [],
      deviceState: {
        deviceType: 'mobile',
        isMobile: true
      },
      isSecondaryAuthEnabled: true
    };
    this.resetDeviceState = this.resetDeviceState.bind(this);
  }

  componentDidMount() {
    Api.get('/configuration').then((response) => {
      this.setState({
        loaded: true,
        underMaintenancePages: response.underMaintenancePages,
        isSecondaryAuthEnabled: response.isSecondaryAuthEnabled
      });
    }).catch(() => {
      this.setState({
        loaded: true,
        underMaintenancePages: []
      });
    });

    this.resetDeviceState();
    window.addEventListener('resize', this.resetDeviceState);
  }

  resetDeviceState() {
    let deviceType = 'desktop';
    if (LayoutService.isMobile()) {
      deviceType = 'mobile';
    }
    if (this.state.deviceState.deviceType !== deviceType) {
      this.setState({
        deviceState: DeviceTypeContext[deviceType]
      });
    }
  }

  render() {
    if (!this.state.loaded) {
      return <LoadingIndicator />;
    }
    const notificationOptions = {
      zIndex: 200, top: '5px', timeout: 5000
    };

    return (
      <SecondaryAuthWrapper enabled={this.state.isSecondaryAuthEnabled}>
        <DeviceTypeContext.Provider value={this.state.deviceState}>
          <ZipgateWrapper>
            <Fragment>
              <Notifications options={notificationOptions} />
              <Router>
                <Switch>
                  <LastLocationProvider>
                    {this.state.underMaintenancePages.map((page) => {
                      const ThisUnderMaintenancePage = () => {
                        return (
                          <UnderMaintenancePage underMaintenance={page} />
                        );
                      };
                      return <Route path={page.path} component={ThisUnderMaintenancePage} />;
                    })}
                    <Route path="/" component={scrollToTop(withAnalytics(HomePage))} exact />
                    <Route path="/browse" component={scrollToTop(withAnalytics(BrowseVehiclePage))} exact />
                    <Route path="/details/:id" component={scrollToTop(withAnalytics(VehicleDetailPage))} exact />
                    <Route path="/out-of-area" component={scrollToTop(withAnalytics(OutOfAreaPage))} exact />
                    <Route path="/terms-and-conditions" component={scrollToTop(withAnalytics(TermsAndConditionsPage))} exact />
                    <Route path="/privacy-policy" component={scrollToTop(withAnalytics(PrivacyPolicyPage))} exact />
                    <Route path="/cookie-statement" component={scrollToTop(withAnalytics(CookieStatementPage))} exact />
                    <Route path="/contact-us" component={scrollToTop(withAnalytics(ContactUsPage))} exact />
                    <Route path="/about-us" component={scrollToTop(withAnalytics(AboutUsPage))} exact />
                    <Route path="/confirmation" component={scrollToTop(withAnalytics(SubscriptionConfirmationPage))} exact />
                    <Route path="/faqs" component={scrollToTop(withAnalytics(FaqsPage))} exact />
                    <Route path="/faqs/categories/:categoryId" component={scrollToTop(withAnalytics(FaqsPage))} exact />
                    <Route path="/faqs/categories/:categoryId/questions/:questionId" component={scrollToTop(withAnalytics(FaqsPage))} exact />
                    <Route path="/subscription-completion" component={scrollToTop(SubscriptionCompletionPage)} exact />
                    <Route path="/approval" component={scrollToTop(withAnalytics(SubscriptionApprovalPage))} exact />
                    <Route path="/login" component={scrollToTop(withAnalytics(LoginPage))} />
                    <Route path="/forgot-password" component={scrollToTop(withAnalytics(ForgotPasswordPage))} />
                    <Route path="/reset-password" component={scrollToTop(withAnalytics(ResetPasswordPage))} />
                    <Route path="/my-account" component={scrollToTop(withAnalytics(MyAccountPage))} />
                    <Route path="/change-password" component={scrollToTop(withAnalytics(ChangePasswordPage))} />
                    <Route path="/not-found" component={scrollToTop(withAnalytics(NotFoundPage))} exact />
                    <Route path="/roadside-assist" component={scrollToTop(withAnalytics(RoadsideAssistancePage))} exact />
                    <Route path="/car-documents" component={scrollToTop(withAnalytics(CarDocumentsPage))} exact />
                    <Route path="/confirm-email" component={scrollToTop(withAnalytics(EmailConfirmationPage))} exact />
                    <Route path="/verify-email" component={scrollToTop(withAnalytics(EmailVerificationPage))} exact />
                    <Route path="/schedule-maintenance" component={scrollToTop(withAnalytics(ScheduleMaintenancePage))} exact />
                    <Route path="/accident-instructions" component={scrollToTop(withAnalytics(AccidentInstructionsPage))} exact />
                    <Route path="/manage-payment" component={scrollToTop(withAnalytics(ManagePaymentPage))} exact />
                    <Route path="/add-payment-method" component={scrollToTop(withAnalytics(AddNewPaymentMethodPage))} exact />
                    <Route path="/update-payment-method" component={scrollToTop(withAnalytics(ChangeDefaultPaymentMethod))} exact />
                    <Route path="/coming-soon" component={scrollToTop(withAnalytics(ComingSoonBrowsePage))} exact />
                    <Route path="/add-ons" component={scrollToTop(withAnalytics(AddOnsPage))} exact />
                    <Route path="/subscription-details" component={scrollToTop(withAnalytics(SubscriptionDetailsPage))} exact />
                    <Route path="/renewal-confirmation" component={withAnalytics(RenewalOptionConfirmationPage)} exact />
                    <Route path="/renewal-preference" component={withAnalytics(SubscriptionRenewalPreferenceOptions)} exact />
                  </LastLocationProvider>
                </Switch>
              </Router>
            </Fragment>
          </ZipgateWrapper>
        </DeviceTypeContext.Provider>
      </SecondaryAuthWrapper>
    );
  }
}

export default Root;
