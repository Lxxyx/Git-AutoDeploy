#! /usr/bin/env node

var fs = require('fs')
var Task = require('shell-task-log')
var forever = require('forever')
var cwd = process.cwd()

var name = process.argv[2]

if (name) {
  stopServer(name)
} else if (fs.existsSync(`${cwd}/hook.json`)) {
  var name = require(`${cwd}/hook.json`).name
  stopServer(name)
} else {
  throw new Err('You must provide a name to stop the server')
}

function stopServer(name) {
  try {
    forever.stop(name)
  } catch (err) {
    throw new Error(err)
  }
  console.log(`${name} is stoped`)
}
