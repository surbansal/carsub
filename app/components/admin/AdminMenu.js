/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import ViewListIcon from '@material-ui/icons/ViewList';
import LogoutButton from '../admin/LogoutButton';

const styles = {
  active: { fontWeight: 'normal' },
};

const AdminMenu = ({ classes, resources, onMenuClick }) => (
  <div>
    {resources.map(resource => (
      <MenuItemLink key={resource.name} leftIcon={<ViewListIcon />} classes={classes} to={`/${resource.name}`} primaryText={resource.options.label} onClick={onMenuClick} />
    ))}
    <LogoutButton />
  </div>
);

const mapStateToProps = state => ({
  resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(withStyles(styles)(AdminMenu)));
