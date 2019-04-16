import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import {userService} from '../../config/ApplicationContext';

class RequiresLogin extends Component {
  componentDidMount() {
    userService.getLoggedInUser().then((user) => {
      if (user === null) {
        if (this.props.fullRefresh) {
          window.location.href = `${window.location.origin}${this.props.redirectTo}`;
          return;
        }
        this.props.history.push({
          pathname: this.props.redirectTo
        });
        return;
      }
      if (this.props.requiredRole !== null && !user.hasRole(this.props.requiredRole)) {
        const roleRedirect = this.props.roleRedirect || this.redirectTo;
        if (this.props.fullRefresh) {
          window.location.href = `${window.location.origin}${roleRedirect}`;
          return;
        }
        this.props.history.push({
          pathname: roleRedirect
        });
      }
    });
  }

  render() {
    return (
      <Fragment>
        {this.props.children}
      </Fragment>
    );
  }
}

RequiresLogin.propTypes = {
  children: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
  requiredRole: PropTypes.string,
  roleRedirect: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  fullRefresh: PropTypes.bool,
};

RequiresLogin.defaultProps = {
  requiredRole: null,
  roleRedirect: null,
  fullRefresh: false,
};

export default withRouter(RequiresLogin);

