util    = require 'util'
fs      = require 'fs'
{spawn} = require 'child_process'
require 'colors'


build = (callback) ->
  coffee = spawn 'coffee', ['-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString().red
  coffee.stdout.on 'data', (data) ->
    util.puts data.toString().green
  coffee.on 'exit', (code) ->
    callback?() if code is 0

task 'build', 'Build lib/ from src/', ->
  build()
