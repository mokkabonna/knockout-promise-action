require.config({
  baseUrl: '/base', //karma servers files from base
  paths: {
    knockout: 'bower_components/knockout/dist/knockout',
    promise: 'bower_components/bluebird/js/browser/bluebird',
  }
});

require(['spec/knockout-promise-actionSpec'], window.__karma__.start);
