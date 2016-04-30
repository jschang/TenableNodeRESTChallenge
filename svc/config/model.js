var util = require('../../util.js');
var data = require('./data.js');

/*
  I decided to implement these with callbacks,
  as in the real-world we'd be talking to a server
  like Mongo.
  In the real-world, there would be an error call back as well.
*/

const fetchIndexOf = function(name) {
  var i = 0;
  for(var conf of data.configs) {
    if(conf.name==name) {
      return i;
    }
    i++;
  }
  return -1;
};

const sortify = (inSort,inDir,data) => {
  if(inSort && inSort.match(/^hostname|username|port|name$/i)) {
    var sort = inSort.toLowerCase();
    var dir = 'asc';
    if(inDir && inDir.match(/^asc|desc$/i)) {
      dir = inDir.toLowerCase();
    }
    util.dbg('sort:',sort,',dir:',dir);
    data.sort(function(a,b) {
        var left = dir == 'asc' ? a[sort] : b[sort];
        var right = dir == 'asc' ? b[sort] : a[sort];
        if(typeof(left[sort])=='string' 
            || typeof(right[sort])=='string') {
          left = left.toLowerCase();
          right = right.toLowerCase();
        } 
        if( left < right ) {
          return -1
        } else if( left > right ){
          return 1;
        }
        return 0;
    });
  }
}

module.exports = {
  /**
   * @param callback cb(ret:array) an array of configs (optional)
   * @param string sort username|hostname|port|name (optional)
   * @param string dir asc|desc (optional; default: asc; ignored if sort not set)
   * @param int start index to start from (optional)
   * @param int count count to return (optional)
   */
  fetchAll:function(cb,sort,dir,start,count) {
    util.dbg('fetchAll parms:',[sort,dir,start,count]);
    var toret = data.configs;
    var start = typeof(start)!='undefined' ? start : 0;
    var count = typeof(count)!='undefined' ? count : 0;
    if(count && start<data.configs.length) {
      toret = data.configs.slice(start,start+count);
    }
    var ret = []
    for(var conf of toret) 
      ret.push(Object.assign({},conf));
    sortify(sort,dir,ret);
    cb(ret);
    return;
  },
  /**
   * @param string name the case-sensitive name of the config desired
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
