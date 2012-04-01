(function() {
  var Clipp, fs, path, sha1;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fs = require('fs');
  path = require('path');
  sha1 = require('sha1');
  Clipp = (function() {
    Clipp.prototype.capacity = 20;
    function Clipp(options) {
      if (options == null) {
        options = {};
      }
      this.options = options;
      this.clipps = [];
      this.load();
    }
    Clipp.prototype.list = function() {
      return this.clipps;
    };
    Clipp.prototype.clippsDir = function() {
      return this.options.clippsDir || path.join(process.env.HOME, '/Dropbox/clipps');
    };
    Clipp.prototype.load = function() {
      var file, str, _i, _len, _ref, _results;
      _ref = this.files();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        str = fs.readFileSync(file, 'utf-8').replace(/^\s+|\s+$/g, '');
        _results.push(str !== '' ? this.clipps.push(str) : void 0);
      }
      return _results;
    };
    Clipp.prototype.files = function() {
      var dir, file, _i, _len, _ref, _results;
      dir = this.clippsDir();
      _ref = fs.readdirSync(dir);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(path.join(dir, file));
      }
      return _results;
    };
    Clipp.prototype.push = function(str) {
      var dir, name;
      dir = this.clippsDir();
      name = sha1(str);
      fs.writeFile(path.join(dir, name), str, 'utf-8', __bind(function() {
        if (this.files().length > this.capacity) {
          return fs.unlink(this.oldestFile());
        }
      }, this));
      return this.clipps.push(str);
    };
    Clipp.prototype.oldestFile = function() {
      var cmtime, file, oldest, omtime, _i, _len, _ref;
      oldest = null;
      _ref = this.files();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (oldest) {
          cmtime = fs.statSync(file).mtime;
          omtime = fs.statSync(oldest).mtime;
          if (cmtime < omtime) {
            oldest = file;
          }
        } else {
          oldest = file;
        }
      }
      return oldest;
    };
    return Clipp;
  })();
  module.exports = Clipp;
}).call(this);
