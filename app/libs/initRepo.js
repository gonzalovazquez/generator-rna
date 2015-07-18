/*jshint strict:false */
'use strict';

var Promise = require('promise');
require('shelljs/global');


var initRepo = function() {
	return new Promise(function(fulfill, reject) {
		var init = exec('git init');
		if (init.code !== 0) {
			reject('Failed to initialize repo');
			exit(1);
		} else {
			fulfill('Successfully initialized repo');
		}
	});
};

var addToRepo = function() {
	return new Promise(function(fulfill, reject) {
		var add = exec('git add --all');
		if (add.code !== 0) {
			reject('Failed to add');
			exit(1);
		} else {
			fulfill('Successfully added');
		}
	});
};

var firstCommit = function() {
	return new Promise(function(fulfill, reject) {
		var commit = exec('git commit -m "first commit"');
		if (commit.code !== 0) {
			reject('Failed to commit');
			exit(1);
		} else {
			fulfill('Successfully committed');
		}
	});
};

var pushRepo = function(endpoint) {
	console.log(endpoint);
	return new Promise(function(fulfill, reject) {
		var setRemote = exec('git remote add origin ' + endpoint);
		var push = exec('git push -u origin master');
		if (setRemote.code !== 0 || push.code !== 0) {
			reject('Failed to pushed');
			exit(1);
		} else {
			fulfill('Successfully pushed');
		}
	});
};



exports.initRepo = initRepo;
exports.addToRepo = addToRepo;
exports.firstCommit = firstCommit;
exports.pushRepo = pushRepo;
