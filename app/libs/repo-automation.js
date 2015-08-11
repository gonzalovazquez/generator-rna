var Nodegit = require('nodegit');
var path = require('path');
var promisify = require('promisify-node');
var fse = promisify(require('fs-extra'));
var Promise = require('promise');
fse.ensureDir = promisify(fse.ensureDir);

var repository, oid, remote, index, repoDir, author, commiter;
var directory, url, username, email, password;




var initializeReposity = function (schema) {
  directory = schema.directory;
  url = schema.url;
  username = schema.username;
  email = schema.email;
  password = schema.password;
  repoDir = require('path').resolve(directory);
  author = Nodegit.Signature.now(username, email);
  committer = Nodegit.Signature.now(username, email);
};


var initializeReposity = function (schema) {
  console.log(schema + 'SCHEMA!!!!');
  directory = schema.directory;
  url = schema.url;
  username = schema.username;
  email = schema.email;
  password = schema.password;

  console.log(directory);

  repoDir = require('path').resolve(directory);
  author = Nodegit.Signature.now(username, email);
  committer = Nodegit.Signature.now(username, email);

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
    .done(function() {
      console.log('remote Pushed!');
      fulfill('remote Pushed!');
    })
    .catch(function(err) {
      console.log(err);
      reject(err);
    })
  });
};

exports.initializeReposity = initializeReposity;
