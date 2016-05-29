var Koa = require('koa')
var Router = require('koa-router')
var body = require('koa-bodyparser')
var logger = require('koa-logger')
var Task = require('shell-task-log')
var fs = require('fs')
var send = require('koa-sendfile')
var forever = require('forever')

const app = new Koa()

app.use(body())
app.use(logger())
  // app.use(function *(next) {
  //   this.send = send
  //   yield next
  // })

const router = new Router()

router
  .get('/', function* () {
    yield send(this, './monitor/index.html')
  })

const api = new Router({
  prefix: '/api'
})

api
  .get('/list', function* () {
    this.body = yield foreverList()
  })
  .post('/stop', function* () {
    var name = this.request.body.name
    var list = yield foreverList()
    if (!list[name]) {
      this.status = 400
      this.body = { code: 400, message: 'You must provide correct forever process name' }
      return false
    }
    if (!list[name].status) {
      this.body = { code: 500, message: `The ${name} is alreay stopped` }
      return false
    }
    forever.stop(name)
    this.body = { code: 200, message: `Stop the ${name}` }
  })


app.use(router.routes())
app.use(api.routes())

app.listen(12315)

function foreverList() {
  return new Promise(function (reslove, reject) {
    forever.list(false, (err, list) => {
      if (err) {
        reject(err)
      } else {
        if (!list) {
          reslove({})
          return true
        }
        var processList = {}
        list.forEach(val => {
          processList[val.uid] = {
            uid: val.uid,
            running: val.running,
            restarts: val.restarts,
            ctime: new Date(val.ctime)
          }
        })
        reslove(processList)
      }
    })
  })
}
