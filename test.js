var Task = require('./task.js')

new Task('ls')
.then('ls')
.run((err, log) => {
  if (err) {
    console.log(err)
  } else {
    console.log(log)
  }
})