const StringReplacePlugin = require('string-replace-webpack-plugin');
const config = require('./webpack.config');

let cookie;
config.devServer.host = 'localhost';
config.devServer.inline = true;
config.devServer.https = false;
config.devServer.proxy = {
  '/dmaapi': {
    target: 'https://devapi.dma.calstate.aaa.com',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/dmaapi': '/api'
    }
  },
  '/api': {
    target: 'https://devapi.carsubscription.calstate.aaa.com',
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq) => {
      if (cookie) {
        proxyReq.setHeader('Cookie', cookie);
      }
    },
    onProxyRes: (proxyRes) => {
      Object.keys(proxyRes.headers).forEach((key) => {
        if (key === 'set-cookie' && proxyRes.headers[key]) {
          const cookieTokens = proxyRes.headers[key][0].split(',');
          cookie = cookieTokens.filter(element => element.includes('JSESSIONID')).join('');
        }
      });
    },
  }
};

const properties = {
  apiBackend: '/api',
  dmaBackend: '/dmaapi',
  enablePWA: 'true',
  segmentIntegrationEnabled: 'true',
  gaTrackingId: 'UA-120231128-5'
};

const stringReplacementLoader = StringReplacePlugin.replace({
  replacements: [
    {
      pattern: /\#{(.*)}/g,
      replacement: function (match, propertyName) {
        return properties[propertyName];
      }
    }
  ]
});

config.module.rules[0].loaders = ['eslint-loader', stringReplacementLoader];

module.exports = config;
