var Nodegit = require('nodegit');
var path = require('path');
var promisify = require('promisify-node');
var fse = promisify(require('fs-extra'));
var Promise = require('promise');
fse.ensureDir = promisify(fse.ensureDir);

var repository, oid, remote, index, author, committer;
var directory, url, username, email, password;


/* Sets working directory */
var setWorkingDirectory = function (name) {
  if (!name) {
    throw new Error('Please specify directory name' + name);
  }
  directory = name;
  console.log('Directory set to ' + directory);
};

/* Create Author and Commiter */
var createAuthor = function (setUsername, setEmail) {
  return new Promise(function (fulfill, reject) {
    username = setUsername;
    email = setEmail;
    author = Nodegit.Signature.now(username, email);
    committer = Nodegit.Signature.now(username, email);
    console.log(author + ' + ' + committer);
    if (!author || !committer) {
      reject(author);
    } else {
      fulfill('Author created ' + author);
    }
  });
};

var setUrl = function (setUrl) {
  if (!setUrl) {
    throw new Error('Please specify a url');
  }
  url = setUrl;
  console.log('URL is set to ' + setUrl);
};

var setCredentials = function(setPassword) {
  if (!setPassword) {
    throw new Error('Please specify a password');
  }
  password = setPassword;
  console.log('Password is set');
};


var initializeReposity = function () {
  return new Promise(function (fulfill, reject) {
    Nodegit.Repository.init(path.resolve(__dirname, directory), 0)
    .then(function(repo) {
      repository = repo;
      console.log('Repository' + repository);
      return repository.openIndex();
    })
    // Create commit
    .then(function(indexResult) {
      index = indexResult;
      return index.read(1);
    })
    .then(function(cb) {
      console.log(cb + 'FROM index read');
      return index.addAll();
    })
    .then(function() {
      return index.write();
    })
    .then(function(cb) {
      console.log(cb + 'FROM index write');
      return index.writeTree();
    })
    .then(function(oidResult) {
      console.log(oidResult + 'oidResult RESULT');
      oid = oidResult;
      return repository.createCommit('HEAD', author, committer, 'First commit', oid, []);
    })
    // Added Remote
    .then(function (commitId) {
      console.log('New Commit: ', commitId);
      console.log(repository);
      remote = Nodegit.Remote.create(repository, 'origin', url);
    })
    // Push
    .then(function() {
      console.log(remote + ' REMOTE');
      remote.setCallbacks({
         credentials: function() {
           return Nodegit.Cred.userpassPlaintextNew(username, password);
         },
         certificateCheck: function() {
           return 1;
         },
     });
     console.log('remote Configured');
     return remote.connect(Nodegit.Enums.DIRECTION.PUSH);
    })
    .then(function () {
       console.log('remote Connected?', remote.connected());
       return remote.push(
               ["refs/heads/master:refs/heads/master"],
               null,
               repository.defaultSignature(),
               "Push to master");
    })
    .then(function() {
      console.log('remote Pushed!');
      fulfill('remote Pushed!');
    })
    .catch(function(err) {
      console.log(err);
      reject(err);
    });
  });
};

exports.createAuthor = createAuthor;
exports.setWorkingDirectory = setWorkingDirectory;
exports.setUrl = setUrl;
exports.setCredentials = setCredentials;
exports.initializeReposity = initializeReposity;
