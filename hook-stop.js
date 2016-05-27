#! /usr/bin/env node

var fs = require('fs')
var Task = require('shell-task')
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
  new Task(`forever stop ${name}`)
    .run(err => {
      if (err) {
        throw new Error(err)
      } else {
        console.log(`${name} is stop!`)
      }
    })
}
