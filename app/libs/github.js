/*jshint strict:false */
'use strict';

var GitHubApi = require('github');
var Promise = require('promise');

/* Initialize Github */
var github = new GitHubApi({
		// required
		version: "3.0.0",
		// optional
		debug: false,
		protocol: "https",
		host: "api.github.com", // should be api.github.com for GitHub
		timeout: 5000,
		headers: {
				"user-agent": "generator-rna" // GitHub is happy with a unique user agent
		}
});

/* Authenticate user */
// github.authenticate({
// 		type: "token",
// 		token: token,
// });
//
// github.authenticate({
//     type: "basic",
//     username: "mikedeboertest",
//     password: "test1324"
// });

var authenticateUser = function(credentials) {
	return new Promise(function (fulfill, reject) {
		github.authenticate({
		    type: "basic",
		    username: credentials.username,
		    password: credentials.password
		}, function(err, result) {
				if (err) {
					reject(err);
				} else {
					fulfill(result);
				}
		});
	})
};

/* Creates repository and returns a promise */
var createRepo = function(appMeta){
	return new Promise(function (fulfill, reject){
		github.repos.create({
		'name': appMeta.app_name,
		'description': appMeta.description
	}, function(err, result) {
			if (err) {
				reject(err);
			} else {
				fulfill(result);
			}
		});
	});
};

exports.authenticateUser = authenticateUser;
exports.createRepo = createRepo;
