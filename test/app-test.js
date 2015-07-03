'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('generator-rna:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ someOption: true })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      '.gitignore'
    ]);
  });
});

describe('generator-rna: Angular App', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts(
        { appType: 'angular' }
      )
      .on('end', done);
  });

  it('should create an Angular App', function() {
     assert.fileContent('bower.json',  /"name": "angular"/);
  });
  
});



  // it('should create a Node App', function() {
  //   // body...
  // });

  // it('should create a React App', function() {
  //   assert.fileContent('bower.json',  /"name": "react"/);
  // });
