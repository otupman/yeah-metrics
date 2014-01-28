var blanket = require("blanket")({ "pattern": ["/routes/"]})
    , keen = require('keen.io')
;
exports.blanket = blanket;

(function myReporter(){
  
  var api = {
    addEvent: function(eventName, data, callback) {
      console.log('LOCAL KEEN IO (no KEEN_IO_PROJECT_KEY environment variable) - not sending data');
      callback(undefined, true);
    }
  };
  if(process.env.KEEN_IO_PROJECT_KEY) {  
    var scopedKey = keen.encryptScopedKey(process.env.KEEN_IO_WRITE_KEY, {
      "allowed_operations": ["write"]
    });
    
    api = keen.configure({
      projectId: process.env.KEEN_IO_PROJECT_KEY,
      writeKey: scopedKey
    });
  }
  
  function reportFile( data,options) {
    var ret = {
      coverage: 0,
      hits: 0,
      misses: 0,
      sloc: 0
    };
    data.source.forEach(function(line, num){
      num++;
      if (data[num] === 0) {
        ret.misses++;
        ret.sloc++;
      } else if (data[num] !== undefined) {
        ret.hits++;
        ret.sloc++;
      }
    });
    ret.coverage = ret.hits / ret.sloc * 100;

    return [ret.hits,ret.sloc];
    
  }
  
  blanket.customReporter=function(cov, callback){
    var totals =[];
    var options = {};
    for (var filename in cov) {
      var data = cov[filename];
      totals.push(reportFile( data,options));
    }
    
    var totalHits = 0;
    var totalSloc = 0;
    totals.forEach(function(elem){
      totalHits += elem[0];
      totalSloc += elem[1];
    });
    
    var globCoverage = (totalHits === 0 || totalSloc === 0) ?
                          0 : totalHits / totalSloc * 100;
    console.log('keen.io custom reporter - sending data');
    api.addEvent("coverage", {score: globCoverage, language: "javascript" }, function(err, res) {
      if(err) {
        console.error("Sending data failed:" , err, res);
      } else {
        console.log('keen.io custom reporter - data SENT');
      }      
      if(callback) {
        callback(err, res);
      }
    });
  };
})();