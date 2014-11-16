require.config({

  paths: {
    'knockout': 'bower_components/knockout/dist/knockout'
  },

  packages: [
    {name: 'deco', location: 'bower_components/deco/Source/deco', main: 'deco'}
  ]

});

require(['deco'], function(deco){
  deco.config().start();
});