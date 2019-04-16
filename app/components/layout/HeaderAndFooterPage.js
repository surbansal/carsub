import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

class HeaderAndFooterPage extends Component {
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
        <Header classNameContentAlignment={this.props.classNameContentAlignment} onMobileNavExpansionChanged={isExpanded => this.mobileNavExpansionChanged(isExpanded)} />
        <div className={`content content-body ${this.props.classNameContentAlignment} ${this.props.className} ${this.state.navMenuActivatedClass}`}>
          {this.props.children}
        </div>
        <Footer className={`${this.props.classNameFooterAlignment} ${this.props.className} ${this.state.navMenuActivatedClass}`} />
      </Fragment>
    );
  }
}

HeaderAndFooterPage.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  classNameFooterAlignment: PropTypes.string,
  classNameContentAlignment: PropTypes.string
};

HeaderAndFooterPage.defaultProps = {
  className: '',
  classNameFooterAlignment: '',
  classNameContentAlignment: ''
};

export default HeaderAndFooterPage;
