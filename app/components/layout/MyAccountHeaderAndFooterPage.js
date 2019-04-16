import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import MyAccountFooter from './MyAccountFooter';
import DeviceTypeContext from '../../contexts/DeviceTypeContext';

class MyAccountHeaderAndFooterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navMenuActivatedClass: ''
    };
  }

  mobileNavExpansionChanged(isExpanded) {
    const navMenuActivatedClass = isExpanded ? 'fade' : '';
    this.setState({
      navMenuActivatedClass
    });
  }

  render() {
    return (
      <Fragment>
        <Header onMobileNavExpansionChanged={isExpanded => this.mobileNavExpansionChanged(isExpanded)} />
        <div className={`${this.props.className} ${this.state.navMenuActivatedClass ? 'fade' : ''}`}>
          {this.props.children}
        </div>
        <DeviceTypeContext.Consumer>
          {deviceContext => (deviceContext.isMobile ? (<MyAccountFooter activeFooterLink={this.props.activeFooterLink} classNameAccountPage={`account-footer ${this.state.navMenuActivatedClass}`} />) : (<Footer />)) }
        </DeviceTypeContext.Consumer>
        {}
      </Fragment>
    );
  }
}

MyAccountHeaderAndFooterPage.propTypes = {
  children: PropTypes.element.isRequired,
  activeFooterLink: PropTypes.string,
  className: PropTypes.string
};

MyAccountHeaderAndFooterPage.defaultProps = {
  activeFooterLink: 'myAccount',
  className: ''
};

MyAccountHeaderAndFooterPage.contextType = DeviceTypeContext;

export default MyAccountHeaderAndFooterPage;
