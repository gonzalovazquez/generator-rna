/*jshint strict:false */
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var github = require('./libs/github.js');
var gitAuto = require('./libs/initRepo.js');
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

		if (!this.options['angular'] && !this.options['react']) {
			var prompt = [
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
				this.appName = response.appName;
				this.appType = response.appType;
				this.gitRepo = 'git@github.com:gonzalovazquez/'+ response.appName + '.git';
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
				description: this.description
			};

			github.createRepo(self.context).done(function (err, res){
				try {
						chalk.green('Repository created' + res);
						gitAuto.initRepo().done(function(err, res) {
							try {
								console.log('Successfully initialized repo' + res);
							} catch  (err) {
								console.log('Failed to initialize repo' + err);
							}
						});
				} catch (err) {
						console.log('Failed to create repository' + err);
				}
			});

			this.template('README.md', this.destinationPath('README.md'), self.context);
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
				console.log('Dependencies have been installed!');

				gitAuto.addToRepo().done(function(err, res) {
					try {
						chalk.green('Successfully added to repo' + res);
						gitAuto.firstCommit().done(function(err, res) {
							try {
								chalk.green('Successfully committed' + res);
								gitAuto.pushRepo(self.context.git_repo).done(function(err, res) {
									try {
										console.log('Successfully pushed to repo' + res);
									} catch  (err) {
										console.log('Failed to push to repo' + err);
									}
								});
							} catch  (err) {
								console.log('Failed to commit ' + err);
							}
						});
					} catch  (err) {
						console.log('Failed to add to repo' + err);
					}
				});

			}
		});
	}
});