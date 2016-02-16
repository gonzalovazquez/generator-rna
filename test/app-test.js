'use strict';

var path = require('path');
var rimraf = require('rimraf');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var mockery = require('mockery');

describe('generator-rna:app', function () {

  describe('generator-rna: angular', function() {

      before(function (done) {
        mockery.registerMock('github', function () {
          return {
            user: {
              authenticate: function (data, cb) {
                cb(null, JSON.stringify({
                  type: 'basic',
                  username: 'gonzalovazquez',
                  password: 'supersecretpassword'
                }));
              }
            },
            repos: {
              create: function (data, cb) {
                cb(null, JSON.stringify({
                  name: 'testAppFromTest',
              		description: 'my super app'
                }));
              }
            }
          };
        });

        helpers.run(path.join(__dirname, '../app'))
          .inDir(path.join(__dirname, 'testApp'))
          .withOptions({ skipInstall: true })
          .withOptions({ skipAutomation: true })
          .withPrompts(
            { username: 'gonzalovazquez' },
            { password: 'supersecretpassword' },
            { appName: 'testApp' },
            { appType: 'AngularJS' }
          )
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

      after(function() {
        rimraf.sync(__dirname +  '/testApp/testApp');
      });
  });

    describe('generator-rna:react', function() {
      before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
          .inDir(path.join(__dirname, 'testApp'))
          .withOptions({ skipInstall: true })
          .withOptions({ skipAutomation: true })
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

      after(function() {
        rimraf.sync(__dirname +  '/testApp/testApp');
      });
    });

    describe('generator-rna with angular arguments', function(){

      before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
          .inDir(path.join(__dirname, 'somethingNew'))
          .withOptions({ skipInstall: true })
          .withOptions({ skipAutomation: true })
          .withOptions({appName: 'somethingNew' })
          .withOptions({angular: 'true' })
          .on('end', done);
      });

      it('should install react dependency', function() {
        assert.fileContent('bower.json', new RegExp('"angular"'));
      });

      it('should include angular dependency', function() {
        assert.fileContent('src/index.html', new RegExp('<script type="text/javascript" src="/bower_components/angular/angular.js"></script>'));
      });

      after(function() {
        rimraf.sync(__dirname +  '/somethingNew/somethingNew');
      });

    });

    describe('generator-rna with react arguments', function(){

      before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
          .withOptions({ skipInstall: true })
          .withOptions({ skipAutomation: true })
          .inDir(path.join(__dirname, 'somethingElse'))
          .withOptions({appName: 'somethingElse' })
          .withOptions({react: 'true' })
          .on('end', done);
      });

      it('should install react dependency', function() {
        assert.fileContent('bower.json', new RegExp('"react"'));
      });

      it('should include angular dependency', function() {
        assert.fileContent('src/index.html', new RegExp('<script type="text/javascript" src="/bower_components/react/react.js"></script>'));
      });

      after(function() {
        rimraf.sync(__dirname +  '/somethingElse/somethingElse');
      });

    });

    describe('generators-rna: empty', function () {

      before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
          .withOptions({ skipInstall: true })
          .withOptions({ skipAutomation: true })
          .inDir(path.join(__dirname, 'emptyShell'))
          .withOptions({appName: 'emptyShell' })
          .withOptions({empty: 'true' })
          .on('end', done);
      });

      it('should not include bower file', function() {
        assert.noFile('bower.json');
      });

      it('should not include package file', function() {
          assert.noFile('package.json');
      });

      it('should include a README.md', function() {
          assert.file('README.md');
      });

      after(function() {
        rimraf.sync(__dirname +  '/emptyShell/emptyShell');
      });
    });
});
