/*jshint strict:false */
'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var github = require('./libs/github.js');
var gitAuto = require('./libs/initRepo.js');
var async = require('async');
var colors = require('colors');
var self = this;

module.exports = yeoman.generators.Base.extend({

	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);

		this.option('skip-install', {
			desc: 'Whether dependencies should be installed',
			type: Boolean,
			defaults: false
		});

		this.option('appName', {
			desc: 'Type your application name',
			type: String,
			require: true
		});

		this.option('angular', {
			desc: 'Create an angular application',
			type: Boolean,
			defaults: false
		});

		this.option('react', {
			desc: 'Create a react application',
			type: Boolean,
			defaults: false
		});
	},

	askFor: function () {
		var done = this.async();

		this.log(yosay('Let\'s create an awesome project!'));

    this.log('In order to authenticate with Gihub, you need to provide your credentials'.green);

		if (!this.options['angular'] && !this.options['react']) {
			var prompt = [
        {
					type    : 'input',
					name    : 'username',
					message : 'What\'s your Github username?',
				},
        {
					type    : 'password',
					name    : 'password',
					message : 'What\'s your Github password?',
				},
				{
					type    : 'input',
					name    : 'appName',
					message : 'Your project name',
					default : this.appname // Default to current folder name
				},
			 {
					type: 'list',
					name: 'appType',
					message: 'Select a type of app you will build today',
					choices: [
						'AngularJS',
						'ReactJS',
						'NodeJS'
					]
				},
				{
					type    : 'input',
					name    : 'description',
					message : 'What are you building?',
				}
			];

			this.prompt(prompt, function (response) {
        this.username = response.username;
        this.password = response.password;
				this.appName = response.appName;
				this.appType = response.appType;
				this.gitRepo = 'git@github.com:' + response.username +'/'+ response.appName + '.git';
				this.description = response.description;

				done();
			}.bind(this));
		} else {
			this.appName = this.options['appName'];
			this.appType = this.options['angular'] ? 'AngularJS' : 'ReactJS';

			done();
		}
	},

	writing: {

		app: function () {

			this.destinationRoot(this.appName);

			self.context = {
				app_type: this.appType,
				app_name: this.appName,
				git_repo: this.gitRepo,
				description: this.description,
        username: this.username,
        password: this.password
			};

      async.series(
        [
          function (callback) {
            var authenticate = github.authenticateUser('basic', self.context);
            console.log('Successfully authenticated with Github');
            callback(null, authenticate);
          },
          function (callback) {
            var createRepository = github.createRepo(self.context);
            console.log('Repository created'.green);
            callback(null, createRepository);
          },
          function (callback) {
            var initializeRepo = gitAuto.initRepo();
            console.log('Successfully initialized repo'.green);
            callback(null, initializeRepo);
          }
        ],
        function (err, result) {
          if (err) {
            console.log('An error occurred' + err);
          }
          console.log(result);
        });

			this.template('_README.md', this.destinationPath('README.md'), self.context);
			this.template('_package.json', this.destinationPath('package.json'), self.context);
			this.template('_bower.json', this.destinationPath('bower.json'), self.context);
			this.template('_src/index.html', this.destinationPath('src/index.html'), self.context);

			this.directory(this.appName, './');
		},

		projectfiles: function () {
			this.fs.copy(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore')
			);

			if (this.appType === 'AngularJS') {
				this.template('_src/js/app.js', this.destinationPath('src/js/app.js'), self.context);
			} else if (this.appType === 'ReactJS') {
				this.fs.copy(
					this.templatePath('_src/js/app_jsx.js'),
					this.destinationPath('src/js/app.js')
				);
			}

			this.fs.copy(
				this.templatePath('_src/styles/main.css'),
				this.destinationPath('src/styles/main.css')
			);
		}
	},

	install: function () {
		this.config.save();

		this.installDependencies({
			bower: true,
			npm: false,
			skipInstall: this.options['skip-install'],
			callback: function () {
				console.log('Dependencies have been installed!'.green);
        async.series(
          [
            function (callback) {
              var intializeRepo = gitAuto.addToRepo();
              callback(null, intializeRepo);
              console.log('Successfully added to repo'.green);
            },
            function (callback) {
              var commitFiles = gitAuto.firstCommit();
              callback(null, commitFiles);
              console.log('Successfully committed'.green);
            },
            function (callback) {
              var pushToOrigin = gitAuto.pushRepo(self.context.git_repo);
              callback(null, pushToOrigin);
              console.log('Successfully pushed to repo'.green);
            }
          ],
          function (err, result) {
            if (err) {
              console.log('An error occurred'.red + err);
            }
            console.log(result);
          });
			}
		});
	}
});
