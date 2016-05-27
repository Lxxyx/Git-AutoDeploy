function generateApp(config) {
  var tasks = `new Task('${config.task[0]}')`
  for (var i = 1, length = config.task.length; i < length; i++) {
    tasks += `
    .then('${config.task[i]}')`
  }

  var app = `
  var Koa = require('koa')
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
    process.chdir('${process.cwd()}')
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

  return app
}

module.exports = generateApp