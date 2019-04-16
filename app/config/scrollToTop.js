import React, {Component} from 'react';
import PropTypes from 'prop-types';

const scrollToTop = (WrappedComponent) => {
  const ComponentScrollToTop = class extends Component {
    // eslint-disable-next-line class-methods-use-this
    componentDidMount() {
      window.scrollTo(0, 0);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  ComponentScrollToTop.propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  return ComponentScrollToTop;
};

export default scrollToTop;
