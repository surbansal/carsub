import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import footerLogo from '../../assets/images/footer-logo.png';

class Footer extends Component {
  componentDidMount() {
    this.updateFooterChanges();
  }
  componentDidUpdate() {
    this.updateFooterChanges();
  }
  updateFooterChanges() {
    if (this.props.className.includes('change-footer')) {
      document.getElementById('root').classList.add('footer-change');
    } else {
      document.getElementById('root').classList.remove('footer-change');
    }
  }
  render() {
    const year = new Date().getFullYear();
    return (
      <div className={`csa-footer content ${this.props.className}`} >
        <div className="logo-area"><img src={footerLogo} alt="aaa-logo" /></div>
        <div className="link-area">
          <div className="link-content">
            <div>
              <h3>Support</h3>
              <ul>
                <li><Link to="/faqs" className="link">FAQs</Link></li>
                <li><Link to="/contact-us" className="link">Contact Us</Link></li>
                <li><Link to="/privacy-policy" className="link">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3>Company</h3>
              <ul>
                <li><Link to="/about-us" className="link">About</Link></li>
                <li><Link to="/terms-and-conditions" className="link">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <div className="content-mobile">
              <div> &copy;{year} AAA Car Subscription LLC</div>
              <div>AAA Car Subscription and the Car Subscription logo are</div>
              <div>trademarks of AAA Car Subscription LLC.</div>
              <div> P.O. Box 24502, Oakland CA 94623</div>
            </div>
            <div className="content-desktop">
              <div>AAA Car Subscription is a service provided by A3 P2P Services</div>
              <div>LLC, a subsidiary of AAA Northern California, Nevada & Utah.</div>
              <div> &copy;{year} AAA Northern California, Nevada & Utah. All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string
};

Footer.defaultProps = {
  className: '',
};

export default Footer;
