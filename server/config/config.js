var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test ') {
  console.log(env);

  var config = require('./config.json');
  var envConfig = config[env.trim()];
  console.log(envConfig);

  Object.keys(envConfig).forEach(function(key) {
    process.env[key] = envConfig[key];
  });
} else {
  console.log('pust ga');
}
