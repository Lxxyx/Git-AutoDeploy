
  var Koa = require('koa')
  var Router = require('koa-router')
  var body = require('koa-bodyparser')
  var logger = require('koa-logger')
  var Task = require('shell-task-log')

  var getLog = function () {
    return new Promise(function(reslove, reject) {
      new Task('git pull')
    .then('pm2 reload run.js')
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
  .get('/koa2-easy', function *(next) {
    process.chdir('/home/lxxyx/Desktop/koa2-easy')
    var log = yield getLog()
    this.body = log
  })

  app.use(router.routes())

  app.listen(5555)
  