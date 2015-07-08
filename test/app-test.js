'use strict';

var path = require('path');
//require('jasmine-beforeall');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var rimraf = require('rimraf');
var tmpDir = path.join( __dirname, './testApp');

describe('generator-rna:app', function () {

  describe('generator-rna angular', function() {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(tmpDir)
        .withOptions({ skipInstall: true })
        .withPrompts({ appName: 'testApp' })
        .withPrompts({ appType: 'AngularJS' })
        .on('end', done);
    });

    it('should create proper scaffolding', function () {
      assert.file([
        'testApp/bower.json',
        'testApp/package.json',
        'testApp/.gitignore',
        'testApp/src/js/app.js',
        'testApp/src/styles/main.css'
      ]);
    });

    // it('should print out app name in bower and package', function() {
    //   assert.fileContent('testApp/bower.json',  /"name": "testApp"/);
    //   assert.fileContent('testApp/package.json',  /"name": "testApp"/);
    // });

    // it('should install angular dependency', function() {
    //   assert.fileContent('testApp/bower.json',  /"dependencies": "angular"/);
    // });

    // it('should include angular dependency', function() {
    //   assert.fileContent('testApp/src/index.html', /"script": "angular"/);
    // });

    afterEach(function(){
      process.chdir(tmpDir+'/../');
      rimraf.sync(tmpDir);
    });
  });

  // describe('generator-rna react', function() {
  //   before(function (done) {
  //     helpers.run(path.join(__dirname, '../app'))
  //       .withOptions({ skipInstall: true })
  //       .withPrompts({ appName: 'app' })
  //       .withPrompts({ appType: 'ReactJS' })
  //       .on('end', done);
  //   });

  //   it('should print out app name in bower and package', function() {
  //     assert.fileContent('app/bower.json',  /"name": "app"/);
  //     assert.fileContent('app/package.json',  /"name": "app"/);
  //   });

  //   it('should install react dependency', function() {
  //     assert.fileContent('app/bower.json',  /"dependencies": "react"/);
  //   });

  //   it('should include react dependency', function() {
  //     assert.fileContent('app/src/index.html', /"script": "react"/);
  //   });
  // });
  
});