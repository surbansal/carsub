import React from 'react';
import { Layout } from 'react-admin';
import AdminMenu from './AdminMenu';

const AdminLayout = props => <Layout {...props} menu={AdminMenu} />;

export default AdminLayout;
