
argv = (require "optimist").argv
ntwitter = require "ntwitter"

connection =
  consumer_key: 'CN1RzIv4muYRMjexm6SjVQ'
  consumer_secret: 'l22vqm7vuBsQoKNK0DeXKmOaT9Rb0oXzRTdNLaWk'
  access_token_key: '467795989-elvBWrq3VmR7gCkI4CC0aagDLsrwePeXwZicihcG'
  access_token_secret: '44lHNrvZlcEAUF57rjxR526JDrNTAVodNM2lNOxI'

twitter = new ntwitter connection

creds = ()->
  twitter.verifyCredentials (err, data) -> console.log data

# Get a List of Users
getUsers = (users, property)->
  twitter.showUser users, (err, users_info) ->
    if property
      users_info.forEach (user) ->
        console.log (eval "user.#{property}")
    else
      console.log users_info

getFollowers = (users, property)->
  twitter.showUser users, (err, users_info) ->
    ids = []
    users_info.forEach (user)->
      ids.push user.id
    twitter.getFollowersIds ids, (err, followers) ->
      console.log err
      console.log followers


command = argv._[0] ? "creds"
arg2 = argv._[1] ? null
arg3 = argv._[2] ? null

switch command
  when "creds" then creds()
  when "users"
    (getUsers (arg2.split ","), arg3) unless arg2 is null
  when "followers"
    #getFollowers "richardclayton"
    (getFollowers (arg2.split ","), arg3) unless arg2 is null
  else creds()


