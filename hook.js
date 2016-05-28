#! /usr/bin/env node
var program = require('commander')

program
  .version('1.00')
  .usage('<command> [options]')
  .command('start', 'generate & start a hook server by hook.json')
  .command('stop [name|hook.json.name]', 'stop hook server by given name or current dir hook.json name')
  .parse(process.argv)
