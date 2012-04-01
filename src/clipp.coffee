fs   = require 'fs'
path = require 'path'
sha1 = require 'sha1'

class Clipp
  capacity: 20
  constructor: (options = {}) ->
    @options = options
    @clipps  = []
    @load()

  list: -> @clipps

  clippsDir: ->
    @options.clippsDir || path.join(process.env.HOME, '/Dropbox/clipps')

  load: ->
    for file in @files()
      str = fs.readFileSync(file, 'utf-8').replace(/^\s+|\s+$/g, '')
      @clipps.push str unless str == ''

  files: ->
    dir  = @clippsDir()
    (path.join(dir, file) for file in fs.readdirSync(dir))

  push: (str) ->
    dir  = @clippsDir()
    name = sha1(str)
    fs.writeFile path.join(dir, name), str, 'utf-8', =>
      fs.unlink @oldestFile() if @files().length > @capacity
    @clipps.push str

  oldestFile: ->
    oldest = null
    for file in @files()
      if oldest
        cmtime = fs.statSync(file).mtime
        omtime = fs.statSync(oldest).mtime
        oldest = file if cmtime < omtime
      else
        oldest = file
    oldest

module.exports = Clipp
