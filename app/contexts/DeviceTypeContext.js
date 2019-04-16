import React from 'react';

const mobileDeviceTypeContext = {
  deviceType: 'mobile',
  isMobile: true
};

const DeviceTypeContext = React.createContext(mobileDeviceTypeContext);

DeviceTypeContext.mobile = mobileDeviceTypeContext;

DeviceTypeContext.desktop = {
  deviceType: 'desktop',
  isMobile: false
};

export default DeviceTypeContext;
