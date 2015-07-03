'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the' + chalk.red('rna') + ' generator!'
    ));

    this.argument('appName', {
      type: String,
      required: false
    });

    var prompts = [
      {
        type: 'string',
        name: 'App Name',
        message: 'What would you like to call your app?'
      },
      {
      type: 'list',
      name: 'appType',
      message: 'What app do you want to build today?',
      choices: [
          {
              value: 'angular',
              name: 'AngularJS'
            },
            {
              value: 'node',
              name: 'NodeJS'
            },
            {
              value: 'react',
              name: 'ReactJS'
            }
        ]
      }
    ];
    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      done();
    }.bind(this));
  },
  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    }
  },
  install: function () {
    console.log(this.props);
    switch(this.props.appType) {
      case 'angular':
        this.log(yosay('Installing AngularJS project'));
        break;
      case 'react':
        this.log(yosay('Installing ReactJS project'));
        break;
      case 'node':
        this.log(yosay('Installing ReactJS project'));
        break;
    }
    this.installDependencies();
  }
});