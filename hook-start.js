#! /usr/bin/env node

var fs = require('fs')
var Task = require('shell-task-log')
var generateApp = require('./generateApp.js')
var serverDir = process.execPath.replace('bin/node', 'lib/node_modules/deploy/server/')
var cwd = process.cwd()

var config
if (fs.existsSync(`${cwd}/hook.json`)) {
  config = require(`${cwd}/hook.json`)
} else {
  throw new Error('You should provide hook.json')
  return false
}

var app = generateApp(config)

var server = `${serverDir}${config.name}.js`
fs.writeFileSync(server, app)
console.log(`Genenate ${server}`)

new Task(`forever start --uid "${config.name}" -a 
-l ${cwd}/${config.name}.log 
${server}`)
  .run(err => {
    if (err) {
      console.log(err)
    } else {
      console.log(`${config.name} is running on port ${config.port}`)
    }
  })