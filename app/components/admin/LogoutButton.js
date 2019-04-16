import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import {userService} from '../../config/ApplicationContext';

class LogoutButton extends Component {
  static logout(e) {
    e.preventDefault();
    userService.logout().then(() => {
      window.location.href = '/';
    });
  }
  render() {
    const StyledButton = withStyles({
      root: {
        display: 'flex',
        'justify-content': 'flex-start'
      },
      label: {
        textTransform: 'capitalize',
      },
    })(Button);
    return (
      <StyledButton
        onClick={LogoutButton.logout}
        size="medium"
        fullWidth
      >
        <ExitIcon /> &nbsp;&nbsp;&nbsp;&nbsp; Logout
      </StyledButton>
    );
  }
}

export default withRouter(LogoutButton);

