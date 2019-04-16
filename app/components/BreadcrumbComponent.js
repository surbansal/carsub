import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

class BreadcrumbComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      url: props.url
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    return (
      <div className={this.props.pageName === 'vehiclepage' ? 'breadcrumb breadcrumb-vehiclepage' : 'breadcrumb' }>
        <Link to={this.state.url} onClick={this.handleClick}>&lt; {this.state.text}</Link>
      </div>
    );
  }
}

BreadcrumbComponent.propTypes = {
  text: PropTypes.string.isRequired,
  pageName: PropTypes.string,
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

BreadcrumbComponent.defaultProps = {
  pageName: null,
  onClick: null
};

export default BreadcrumbComponent;
