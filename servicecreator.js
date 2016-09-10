function createWebServerService(execlib, ParentService) {
  'use strict';
  

  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function WebServerService(prophash) {
    ParentService.call(this, prophash);
  }
  
  ParentService.inherit(WebServerService, factoryCreator);
  
  WebServerService.prototype.__cleanUp = function() {
    ParentService.prototype.__cleanUp.call(this);
  };

  WebServerService.prototype._onRequest = function (req, res) {
    console.log(req);
    res.end('ok');
  };
  
  return WebServerService;
}

module.exports = createWebServerService;
