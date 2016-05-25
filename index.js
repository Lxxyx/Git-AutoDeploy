#! /usr/bin/env node

var fs = require('fs')
var deployConfig = require('./deploy.json')
var Task = require('shell-task')
var tasks = `new Task('${deployConfig.task[0]}')`

for (var i = 1, length = deployConfig.task.length; i < length; i++) {
  tasks += `.then('${deployConfig.task[i]}')`
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
.get('/${deployConfig.name}', function *(next) {
  this.body = 'This is ${deployConfig.name}'
  ${tasks}
  .run((err, next) => {
    if (err) {
      console.log(err)
    }
  })
  
})

app.use(router.routes())

app.listen(${deployConfig.port})
`

fs.writeFileSync(`${deployConfig.name}.js`, app)

console.log(`Genenate ${deployConfig.name}.js Done!`)
console.log(`${deployConfig.name} is running on port ${deployConfig.port}`)
new Task(`node ${deployConfig.name}.js`)
.run(err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Start Run')
  }
})
