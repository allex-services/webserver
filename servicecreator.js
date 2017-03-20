function createWebServerService(execlib, ParentService) {
  'use strict';
  
  var StaticServer = require('node-static').Server,
    lib = execlib.lib;

  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function WebServerService(prophash) {
    var path;
    ParentService.call(this, prophash);
    this.staticServer = null;
    if (lib.isArray(prophash.root)) {
      path = require('path');
      prophash.root = path.join.apply(path, prophash.root);
    }
    this.staticServer = new StaticServer(prophash.root, prophash.cacheinterval||0);
  }
  
  ParentService.inherit(WebServerService, factoryCreator);
  
  WebServerService.prototype.__cleanUp = function() {
    this.staticServer = null;
    ParentService.prototype.__cleanUp.call(this);
  };

  WebServerService.prototype._onRequest = function (req, res) {
    req.addListener('end', this.staticServer.serve.bind(this.staticServer, req, res)).resume();
  };

  WebServerService.prototype.propertyHashDescriptor = {
    root: {
      oneOf: [{
        type: 'string'
      },{
        type: 'array',
        items: {
          type: 'string'
        }
      }]
    }
  };
  
  return WebServerService;
}

module.exports = createWebServerService;
