import React, { Component, Fragment } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import headerImg from '../../assets/images/header-logo.png';
import headerImgMobile from '../../assets/images/header-logo-mobile.png';
import { userService } from '../../config/ApplicationContext';
import MobileHeader from './MobileHeader';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAdmin: null,
      isSubscriber: null,
      headerLink: '/'
    };
    this.logout = this.logout.bind(this);
    this.checkIsAdmin = this.checkIsAdmin.bind(this);
  }

  componentWillMount() {
    this.refreshUser();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.state.user) {
        this.setState({ headerLink: '/my-account' });
      } else {
        this.setState({ headerLink: '/' });
      }
    }, 0);
  }

  // eslint-disable-next-line class-methods-use-this
  checkIsAdmin(user) {
    if (!user || !user.roles) {
      return false;
    }
    for (let i = 0; i < user.roles.length; i += 1) {
      if (user.roles[i].name === 'ROLE_CSA_ADMIN') {
        return true;
      }
    }
    return false;
  }

  refreshUser() {
    userService.getLoggedInUser().then((user) => {
      const isAdmin = this.checkIsAdmin(user);
      const isSubscriber = user && !isAdmin;
      this.setState({
        user,
        isAdmin,
        isSubscriber
      });
    });
  }

  logout(e) {
    e.preventDefault();
    userService.logout().then(() => {
      this.setState({
        user: null,
        isAdmin: null,
        isSubscriber: null
      });
      this.props.history.push({
        pathname: '/'
      });
    });
  }

  render() {
    let logoutLink = <Fragment />;
    if (this.state.user) {
      logoutLink = (
        <Link to="/" onClick={this.logout}>Sign Out</Link>
      );
    }

    let accountLink = <Fragment />;
    if (this.state.isAdmin) {
      accountLink = (
        <a href="/admin">Admin</a>
      );
    } else if (this.state.user) {
      accountLink = (
        <NavLink activeClassName="active" to="/my-account">My Account</NavLink>
      );
    } else {
      accountLink = (
        <NavLink activeClassName="active" to="/login">Sign In</NavLink>
      );
    }

    const links = (
      <Fragment>
        <NavLink activeClassName="active" to="/browse">Browse Cars</NavLink>
        <NavLink activeClassName="active" to="/faqs">FAQs</NavLink>
        {accountLink}
        {logoutLink}
      </Fragment>
    );

    return (
      <header>
        <div className={this.state.user ? `csa-header content silver-bg ${this.props.classNameContentAlignment}` : `csa-header content ${this.props.classNameContentAlignment}`}>
          <div className="header-logo">
            <Link className="mobile-only" to={this.state.headerLink} onClick={() => window.scrollTo(0, 0)}><img src={headerImgMobile} className="Header Logo" alt="Header Logo" /></Link>
            <Link className="desktop-only" to={this.state.headerLink}><img src={headerImg} className="desktop-logo" alt="Header Logo" /></Link>
          </div>
          <div className="header-nav">
            {links}
          </div>
          <MobileHeader {...this.state} logout={this.logout} onMobileNavExpansionChanged={this.props.onMobileNavExpansionChanged} />
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  onMobileNavExpansionChanged: PropTypes.func,
  classNameContentAlignment: PropTypes.string
};

Header.defaultProps = {
  onMobileNavExpansionChanged: () => {},
  classNameContentAlignment: ''
};

export default withRouter(Header);
