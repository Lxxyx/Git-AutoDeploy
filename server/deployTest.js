
  var Koa = require('koa')
  var Router = require('koa-router')
  var body = require('koa-bodyparser')
  var logger = require('koa-logger')
  var Task = require('shell-task-log')

  var getLog = function () {
    return new Promise(function(reslove, reject) {
      new Task('git add *')
    .then('git commit -m "auto deploy"')
    .then('git push -u origin master')
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
  .get('/deployTest', function *(next) {
    process.chdir('/home/lxxyx/Desktop/deploy')
    var log = yield getLog()
    this.body = log
  })

  app.use(router.routes())

  app.listen(8000)
  