var util = require('../../util.js');
var data = require('./data.js');

/*
  I decided to implement these with callbacks,
  as in the real-world we'd be talking to a server
  like Mongo.
  In the real-world, there would be an error call back as well.
*/

var fetchIndexOf = function(name) {
  var i = 0;
  for(var conf of data.configs) {
    if(conf.name==name) {
      return i;
    }
    i++;
  }
  return -1;
};

module.exports = {
  /**
   * @param callback cb(ret:array) an array of configs
   */
  fetchAll:function(cb) {
    var ret = []
    for(var conf of data.configs) 
      ret.push(Object.assign({},conf));
    cb(ret);
    return;
  },
  /**
   * @param callback cb(ret:object) the specific config, if found, else null
   */
  fetch:function(name,cb) {
    for(var conf of data.configs) {
      if(conf.name==name) {
        cb(Object.assign({},conf));
        return;
      }
    }
    cb(null);
  },
  create:function(config,cb) {
    this.fetch(config.name,(existingConfig)=> {
      if(existingConfig) {
        cb(false);
        return;
      } else {
        data.configs.push(Object.assign({},config));
        cb(true);
        return;
      }
      cb(false);
    });
  },
  /**
   * @param callback succ(didUpdate:bool)
   */
  delete:function(config,cb) {
    var confIdx = fetchIndexOf(config.name)
    if(confIdx!=(-1)) {
      util.log('DELETE: ',config);
      data.configs.splice(confIdx,1);
      util.dbg('DELETE new configs: ',data.configs);
      cb(true);
      return;
    }
    cb(false);
    return;
  },
  /**
   * @param callback succ(didUpdate:bool)
   */
  update:function(config,cb) {
    var self = this;
    this.delete(config,function(didDelete){
      if(didDelete) {
        self.create(config,function(didCreate){
           cb(didCreate);
           return;
        });
      } else cb(false);
    });
  }
}
