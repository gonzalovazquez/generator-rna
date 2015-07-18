'use strict';

var Promise = require('promise');
require('shelljs/global');


var initRepo = function() {
	return new Promise(function(fulfill, reject) {
		var init = exec('git init');
		if (init !== 0) {
			reject('Failed to initialize repo');
			exit(1);
		} else {
			fulfill('Successfully initialized repo');
		}
	});
};

exports.initRepo = initRepo;