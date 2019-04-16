/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Element, scroller} from 'react-scroll';
import {ContentfulService, userService, segmentAnalytics} from '../../config/ApplicationContext';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import Message from '../home-page/Message';
import MarkdownContent from '../content/MarkdownContent';
import LeasePurchase from '../home-page/LeasePurchase';
import VideoAsset from '../content/VideoAsset';
import './HomePage.scss';
import HowItWork from '../home-page/HowItWork';
import HeroImageAsset from '../content/HeroImageAsset';
import EasyToUse from '../home-page/EasyToUse';
import ImageAsset from '../content/ImageAsset';
import LoadingIndicator from '../LoadingIndicator';
import DeviceTypeContext from '../../contexts/DeviceTypeContext';

class HomePage extends Component {
  static scrollToHowItWorksSection() {
    segmentAnalytics.track('Home Page Hero Button Click', {
      category: 'Learn More'
    });

    scroller.scrollTo('message', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      isSubscriber: true,
      content: null,
      leasePurchase: [],
      leasePurchaseMobile: [],
      easyToUse: [],
      howItWork: [],
      includedWithSubscription: [],
      easyToUseTitle: '',
      howItWorksTitle: '',
      includedWithSubscriptionTitle: ''
    };
    this.checkUser = this.checkUser.bind(this);
    this.handleHowToVideoPlay = this.handleHowToVideoPlay.bind(this);
    this.handleHowToVideoPause = this.handleHowToVideoPause.bind(this);
    this.handleHowToVideoEnd = this.handleHowToVideoEnd.bind(this);
  }

  componentWillMount() {
    this.checkUser();
  }

  componentDidMount() {
    try {
      const optimizelyVariation = optimizely.get('state').getVariationMap()['10846111546'];
      if (optimizelyVariation !== undefined) {
        const contentfulId = optimizelyVariation.name;
        ContentfulService.getEntries({ 'sys.id': contentfulId, include: 5 }).then((resp) => {
          this.setState({
            content: resp.items[0].fields,
            leasePurchase: resp.items[0].fields.leasePurchase,
            leasePurchaseMobile: resp.items[0].fields.leasePurchaseMobile,
            easyToUse: resp.items[0].fields.easyToUse,
            howItWork: resp.items[0].fields.howItWorksContent,
            easyToUseTitle: resp.items[0].fields.easyToUseTitle,
            howItWorksTitle: resp.items[0].fields.howItWorksTitle,
            includedWithSubscription: resp.items[0].fields.includedWithSubscription,
            includedWithSubscriptionTitle: resp.items[0].fields.includedWithSubscriptionTitle
          });
        });
      } else {
        this.setDefaultHomepage();
      }
    } catch (ex) {
      this.setDefaultHomepage();
    }

    window.addEventListener('load', () => {
      const params = new URLSearchParams(this.props.location.search);
      if (params.get('howitworks') === 'true') {
        scroller.scrollTo('video', {
          duration: 0,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      }
    });
  }
  setDefaultHomepage() {
    ContentfulService.getEntries({ 'sys.id': '18hd5k8oT4I0OAMQCUMWUO', include: 5 }).then((resp) => {
      this.setState({
        content: resp.items[0].fields,
        leasePurchase: resp.items[0].fields.leasePurchase,
        leasePurchaseMobile: resp.items[0].fields.leasePurchaseMobile,
        easyToUse: resp.items[0].fields.easyToUse,
        howItWork: resp.items[0].fields.howItWorksContent,
        easyToUseTitle: resp.items[0].fields.easyToUseTitle,
        howItWorksTitle: resp.items[0].fields.howItWorksTitle,
        includedWithSubscription: resp.items[0].fields.includedWithSubscription,
        includedWithSubscriptionTitle: resp.items[0].fields.includedWithSubscriptionTitle
      });
    });
  }

  checkUser() {
    userService.getLoggedInUser().then((user) => {
      const isSubscriber = user && !user.hasRole('ROLE_CSA_ADMIN');
      if (isSubscriber) {
        this.props.history.push({
          pathname: '/my-account',
        });
      }
      this.setState({
        isSubscriber
      });
    });
  }

  handleBrowseClick() {
    segmentAnalytics.track('Home Page - Find Your Car', { category: 'Find Your Car'});
    this.props.history.push({pathname: '/browse'});
  }

  // eslint-disable-next-line class-methods-use-this
  handleHowToVideoPlay() {
    segmentAnalytics.track('Play', { category: 'How To Video', label: 'Home Page'});
  }

  // eslint-disable-next-line class-methods-use-this
  handleHowToVideoPause() {
    segmentAnalytics.track('Paused', { category: 'How To Video', label: 'Home Page'});
  }

  // eslint-disable-next-line class-methods-use-this
  handleHowToVideoEnd() {
    segmentAnalytics.track('End', { category: 'How To Video', label: 'Home Page'});
  }

  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      Content = () => (
        <Fragment>
          <HeroImageAsset heroImage={this.state.content.heroImage} height="486px" width="100%"scrollTo={HomePage.scrollToHowItWorksSection} title="true" type="home" />
          <Message scrollTo={HomePage.scrollToHowItWorksSection} messageTitle={this.state.content.message.fields.title} messageDescription={this.state.content.message.fields.description} buttonText={this.state.content.message.fields.buttonText} />
          <DeviceTypeContext.Consumer>
            { deviceContext => <LeasePurchase leasePurchaseData={deviceContext.isMobile ? this.state.leasePurchaseMobile : this.state.leasePurchase} />}
          </DeviceTypeContext.Consumer>
          <div className="included-subscription">
            <div className="title">
              <h2 className="medium">{this.state.includedWithSubscriptionTitle}</h2>
            </div>
            {this.state.includedWithSubscription.map((data) => {
              return (
                <div key={data.fields.title} className="included-item">
                  <ImageAsset image={data.fields.image} />
                  <h2 className="medium">{data.fields.title}</h2>
                </div>
              );
            })
            }
          </div>
          <EasyToUse easyToUse={this.state.easyToUse} easyToUseTitle={this.state.easyToUseTitle} />
          <div className="video-holder" name="video">
            <div className="title">
              <h2 className="medium">See what AAA Car Subscription is all about </h2>
            </div>
            <VideoAsset
              videoData={this.state.content.video}
              onPause={this.handleHowToVideoPause}
              onPlay={this.handleHowToVideoPlay}
              onEnd={this.handleHowToVideoEnd}
            />
          </div>
          <Element className="how-it-works" name="how-it-works">
            <HowItWork howItWorkData={this.state.howItWork} howItWorksTitle={this.state.howItWorksTitle} />
          </Element>
          <div className="call-to-action">
            <span className="desktop-only"><MarkdownContent markdown={this.state.content.callToAction.fields.description} /></span>
            <div className="mobile mobile-only">
              <div >
                <h3>Questions ?</h3>
                <Link to="/faqs" className="link">Visit our FAQs</Link>
              </div>
              <div>
                <h3>Call us at </h3>
                <a href="tel:18003602228">1-800-360-2228</a>
              </div>
              <div>
                <h3>Email us at </h3>
                <a href="mailto:carsubscription@norcal.aaa.com">carsubscription@norcal.aaa.com</a>
              </div>
            </div>
            <div className="find-car-panel hide">
              <button className="csa-button primary" onClick={() => { this.handleBrowseClick(); }}>{this.state.content.callToAction.fields.buttonText}</button>
            </div>
          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        {this.state.isSubscriber ? <LoadingIndicator /> :
          (
            <HeaderAndFooterPage className="home-page" classNameFooterAlignment="change-footer">
              <Content />
            </HeaderAndFooterPage>
          )
        }
      </Fragment>
    );
  }
}

HomePage.contextType = DeviceTypeContext;

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
};

export default withRouter(HomePage);
