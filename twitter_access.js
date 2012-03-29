(function() {
  var arg2, arg3, argv, command, connection, creds, getFollowers, getUsers, ntwitter, twitter, _ref, _ref2, _ref3;

  argv = (require("optimist")).argv;

  ntwitter = require("ntwitter");

  connection = {
    consumer_key: 'CN1RzIv4muYRMjexm6SjVQ',
    consumer_secret: 'l22vqm7vuBsQoKNK0DeXKmOaT9Rb0oXzRTdNLaWk',
    access_token_key: '467795989-elvBWrq3VmR7gCkI4CC0aagDLsrwePeXwZicihcG',
    access_token_secret: '44lHNrvZlcEAUF57rjxR526JDrNTAVodNM2lNOxI'
  };

  twitter = new ntwitter(connection);

  creds = function() {
    return twitter.verifyCredentials(function(err, data) {
      return console.log(data);
    });
  };

  getUsers = function(users, property) {
    return twitter.showUser(users, function(err, users_info) {
      if (property) {
        return users_info.forEach(function(user) {
          return console.log(eval("user." + property));
        });
      } else {
        return console.log(users_info);
      }
    });
  };

  getFollowers = function(users, property) {
    return twitter.showUser(users, function(err, users_info) {
      var ids;
      ids = [];
      users_info.forEach(function(user) {
        return ids.push(user.id);
      });
      return twitter.getFollowersIds(ids, function(err, followers) {
        console.log(err);
        return console.log(followers);
      });
    });
  };

  command = (_ref = argv._[0]) != null ? _ref : "creds";

  arg2 = (_ref2 = argv._[1]) != null ? _ref2 : null;

  arg3 = (_ref3 = argv._[2]) != null ? _ref3 : null;

  switch (command) {
    case "creds":
      creds();
      break;
    case "users":
      if (arg2 !== null) getUsers(arg2.split(","), arg3);
      break;
    case "followers":
      if (arg2 !== null) getFollowers(arg2.split(","), arg3);
      break;
    default:
      creds();
  }

}).call(this);
