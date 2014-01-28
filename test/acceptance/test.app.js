var request = require('supertest')
    , express = require('express')
    , mockery = require('mockery')
    , test_helper = require('../test_helper')
    , blanket = test_helper.blanket
;
var app = null;
var mongoMock = {
  user: {
    findOne: function () { return {}; }  
  }
};


describe('GET /', function(){
  before(function() {
    mockery.enable();
    mockery.warnOnUnregistered(false);
    mockery.registerMock('mongojs', function(url, username) {
      return mongoMock;
    });
    app = require(__dirname + '/../../app.js').app;
  });
  
  after(function() {
    mockery.disable();
    if(blanket.customReporter) {
      blanket.customReporter(global._$jscoverage, function(err, res) {
        if(err) {
          console.log('Error sending data to Keen.io');
        } else {
          console.log('Data sent successfully');
        }
      }); 
    }
  });
  
  it('respond with plain text', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  })
});
