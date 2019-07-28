module.exports = function(api) {
  api.cache(true);
  const presets = [
    '@babel/preset-env',
  ];
  const alias = {
    'bin': './src/bin',
    'config': './src/app/config',
    'models': './src/app/models',
    'controllers': './src/app/http/controllers',
    'middlewares': './src/app/http/middlewares',
    'routes': './src/app/http/routes',
    'schemas': './src/app/http/schemas',
    'locales': './src/app/locales',
    'logs': './src/app/logs',
    'libraries': './src/app/libraries',
    'helpers': './src/app/helpers',
    'views': './src/app/views',
    'app': './src/app/index',
    'env': './src/app/env',
    'events': './src/app/events',
    'loader': './src/app/loader',
    'router': './src/app/libraries/router',
    'core': './src/app/core',
    'www': './src/bin/www',
    'server': './src/bin/server',
    'src': './src',
  };

  const plugins = [
    [
      'module-resolver', {'root': ['./src/app'], alias},
    ],
    [
      '@babel/plugin-transform-runtime',
    ],
  ];
  return {
    presets,
    plugins,
  };
};
