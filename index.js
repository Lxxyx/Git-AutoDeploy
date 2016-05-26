#! /usr/bin/env node

var fs = require('fs')
var cwd = process.cwd()
var modulePath = process.execPath.replace('bin/node', 'lib/node_modules/deploy/')
var config = require(`${cwd}/hook.json`)
var Task = require('shell-task')
var tasks = `new Task('${config.task[0]}')`

for (var i = 1, length = config.task.length; i < length; i++) {
  tasks += `
  .then('${config.task[i]}')`
}

var app = `var Koa = require('koa')
var Router = require('koa-router')
var body = require('koa-bodyparser')
var logger = require('koa-logger')
var Task = require('shell-task')

const app = new Koa()

app.use(body())
app.use(logger())

const router = new Router()

router
.get('/', function *(next) {
  this.body = 'Hello Koa'
})
.get('/${config.name}', function *(next) {
  this.body = 'This is ${config.name}'
  process.chdir('${cwd}')
  ${tasks}
  .run((err, next) => {
    if (err) {
      console.log(err)
    }
  })
  
})

app.use(router.routes())

app.listen(${config.port})
`

fs.writeFileSync(`${modulePath}${config.name}.js`, app)

console.log(`Genenate ${config.name}.js at ${modulePath}`)
new Task(`forever start ${modulePath}${config.name}.js`)
.run(err => {
  if (err) {
    console.log(err)
  } else {
    console.log(`${config.name} is running on port ${config.port}`)
  }
})
