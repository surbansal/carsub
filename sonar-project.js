const sonarqubeScanner = require('sonarqube-scanner');
var argv = require('minimist')(process.argv.slice(2));
sonarqubeScanner({
  serverUrl: argv.sonarHost,
  options: {
    "sonar.projectBaseDir": "app"
  }
}, () => {});
