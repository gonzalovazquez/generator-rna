'use strict';

var path = require('path');
var rimraf = require('rimraf');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('generator-rna:app', function () {


  describe('generator-rna: angular', function() {

      before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
          .inDir(path.join(__dirname, '.testApp'))
          .withOptions({ skipInstall: true })
          .withPrompts({ appName: 'testApp' })
          .withPrompts({ appType: 'AngularJS' })
          .on('end', done);
      });

      it('can be required without throwing', function() {
        this.app = require('../app');
      });

      it('should create proper scaffolding', function () {
          assert.file([
            'bower.json',
            'package.json',
            '.gitignore',
            'src/js/app.js',
            'src/styles/main.css'
          ]);
      });

      it('should print out app name in bower and package', function() {
        assert.fileContent('bower.json',  /"name": "testApp"/);
        assert.fileContent('package.json',  /"name": "testApp"/);
      });

      it('should install angular dependency', function() {
        assert.fileContent('bower.json', new RegExp('"angular"'));
      });

      it('should include angular dependency', function() {
        assert.fileContent('src/index.html', new RegExp('<script type="text/javascript" src="/bower_components/angular/angular.js"></script>'));
      });

      afterEach(function() {
        rimraf.sync('testApp');
      });
  });

    before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
          .inDir(path.join(__dirname, '.testApp'))
          .withOptions({ skipInstall: true })
          .withPrompts({ appName: 'testApp' })
          .withPrompts({ appType: 'ReactJS' })
          .on('end', done);
      });

      it('should print out app name in bower and package', function() {
        assert.fileContent('bower.json',  /"name": "testApp"/);
        assert.fileContent('package.json',  /"name": "testApp"/);
      });

      it('should install react dependency', function() {
        assert.fileContent('bower.json', new RegExp('"react"'));
      });

      it('should include react dependency', function() {
        assert.fileContent('src/index.html', new RegExp('<script type="text/javascript" src="/bower_components/react/react.js"></script>'));
      });

      afterEach(function() {
        rimraf.sync('testApp');
      }); 

});

