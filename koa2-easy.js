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
.get('/koa2-easy', function *(next) {
  this.body = 'This is koa2-easy'
  process.chdir('/home/lxxyx/Desktop/koa2-easy')
  new Task('ls')
  .run((err, next) => {
    if (err) {
      console.log(err)
    }
  })
  
})

app.use(router.routes())

app.listen(5555)
