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
  var Task = require('shell-task-log')

  var getLog = function () {
    return new Promise(function(reslove, reject) {
      ${tasks}
      .run((err, log) => {
        if (err) {
          reject(err)
        }
        reslove(log)
      })
    })
  }
  
  const app = new Koa()

  app.use(body())
  app.use(logger())

  const router = new Router()

  router
  .get('/', function *(next) {
    this.body = 'Hello Koa'
  })
  .get('/${config.name}', function *(next) {
    process.chdir('${process.cwd()}')
    var log = yield getLog()
    this.body = log
  })

  app.use(router.routes())

  app.listen(${config.port})
  `

  return app
}

module.exports = generateApp