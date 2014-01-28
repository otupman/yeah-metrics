var request = require('supertest')
    , express = require('express')
    , mockery = require('mockery')
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
    mockery.registerMock('mongojs', function(url, username) {
      return mongoMock;
    });
    app = require(__dirname + '/../app.js').app;
  });
  
  after(function() {
    mockery.disable();
  });
  
  it('respond with plain text', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  })
});
