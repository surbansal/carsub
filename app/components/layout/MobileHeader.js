/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {Component, Fragment} from 'react';
import {Link, NavLink, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {segmentAnalytics} from '../../config/ApplicationContext';

class MobileHeader extends Component {
  static selectItem(e) {
    segmentAnalytics.track('Hamburger link selected', {category: 'Hamburger menu', label: e.target.pathname});
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.closeMenuOnClick = this.closeMenuOnClick.bind(this);
    this.expandMenu = this.expandMenu.bind(this);
    this.headerRef = React.createRef();
  }
  componentDidMount() {
    document.addEventListener('touchstart', this.closeMenuOnClick, {passive: false});
  }
  componentWillUnmount() {
    document.removeEventListener('touchstart', this.closeMenuOnClick, {passive: false});
  }
  closeMenuOnClick(e) {
    if (!this.headerRef.current.contains(e.target) && this.state.expanded) {
      e.preventDefault();
      e.stopPropagation();
      this.expandMenu();
    }
  }
  expandMenu() {
    const expanded = !this.state.expanded;
    if (expanded) {
      segmentAnalytics.track('Hamburger menu opened', {category: 'Hamburger menu', label: this.props.location.pathname});
    } else {
      segmentAnalytics.track('Hamburger menu closed', {category: 'Hamburger menu'});
    }
    this.setState({
      expanded
    }, this.props.onMobileNavExpansionChanged(expanded));
  }
  render() {
    let signInOut = <Fragment />;
    if (this.props.user) {
      signInOut = (
        <span onClick={this.props.logout}>
          <Link to="/" onClick={this.props.logout}>Sign Out</Link>
        </span>
      );
    } else {
      signInOut = (
        <span onClick={() => this.props.history.push('/login')}>
          <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/login" >Sign In</NavLink>
        </span>
      );
    }
    let mobileAccountLink = <Fragment />;
    if (this.props.isAdmin) {
      mobileAccountLink = (
        <Fragment>
          <a onClick={MobileHeader.selectItem} href="/admin">Admin</a>
          <hr />
        </Fragment>);
    } else if (this.props.user) {
      mobileAccountLink = (
        <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/my-account">My Account</NavLink>
      );
    }

    let mobileSubscriberLinks = <Fragment />;
    let mobileTopAnonymousLinks = <Fragment />;
    let mobileBottomAnonymousLinks = <Fragment />;
    let mobileButtonLink = <Fragment />;
    if (this.props.isSubscriber) {
      mobileSubscriberLinks = (
        <Fragment>
          <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/roadside-assist">Roadside Assistance</NavLink>
          <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/manage-payment">Manage Payments</NavLink>
          <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/schedule-maintenance">Schedule Maintenance</NavLink>
          <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/accident-instructions">Accident Instructions</NavLink>
          <hr />
          <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/browse" >Browse Cars</NavLink>
        </Fragment>
      );
    } else {
      mobileTopAnonymousLinks = (
        <Fragment>
          <NavLink onClick={MobileHeader.selectItem} exact activeClassName="active" to="/">Home</NavLink>
        </Fragment>
      );
      mobileBottomAnonymousLinks = (
        <Fragment>
          <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/about-us">About Us</NavLink>
        </Fragment>
      );
      mobileButtonLink = (
        <div className="button-wrapper">
          <button className="csa-button primary">
            <NavLink onClick={MobileHeader.selectItem} activeClassName="active-button" to="/browse">Browse Cars</NavLink>
          </button>
        </div>
      );
    }

    return (
      <div className="mobile-nav" ref={this.headerRef}>
        <div className="menu-icon" tabIndex="0" role="menu" onClick={this.expandMenu} onKeyUp={this.expandMenu}>
          {this.state.expanded ? (
            <div className="close-notification" />
          ) : (
            <Fragment>
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </Fragment>
          )
        }
        </div>
        <div className={this.state.expanded ? 'menu-content expanded' : 'menu-content'} style={{ zIndex: 100 }}>
          <span onClick={this.expandMenu}>
            {mobileAccountLink}
            {mobileTopAnonymousLinks}
            {mobileSubscriberLinks}
            <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/faqs" >FAQs</NavLink>
            <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/contact-us">Contact Us</NavLink>
            <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/privacy-policy">Privacy Policy</NavLink>
            <NavLink onClick={MobileHeader.selectItem} activeClassName="active" to="/terms-and-conditions">Terms &amp; Conditions</NavLink>
            {mobileBottomAnonymousLinks}
            {signInOut}
            {mobileButtonLink}
          </span>
        </div>
      </div>
    );
  }
}

MobileHeader.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.shape(),
  isAdmin: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  isSubscriber: PropTypes.bool,
  onMobileNavExpansionChanged: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

MobileHeader.defaultProps = {
  user: null,
  isAdmin: null,
  isSubscriber: null
};

export default withRouter(MobileHeader);
