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
.get('/deployTest', function *(next) {
  this.body = 'This is deployTest'
  new Task('git add *').then('git commit -m "auto deploy"').then('git push -u origin master')
  .run((err, next) => {
    if (err) {
      console.log(err)
    }
  })
  
})

app.use(router.routes())

app.listen(8000)
