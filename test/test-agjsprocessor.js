'use strict';
var assert = require('assert');
var AGJSProcessor = require('../lib/agjsprocessor');

describe('angular js processor', function () {
  it('should initialize correctly', function () {
    var cp = new AGJSProcessor('', '', '\n', 3);
    assert(cp !== null);
    assert.equal(3, cp.revvedfinder);
    assert.equal('\n', cp.linefeed);
  });

  describe('process', function () {
    var mapping = {
      'views/main.html': 'views/2123.main.html',
      '../../views/main.html': '../../views/2123.main.html'
    };
    var revvedfinder = {
      find: function (s) {
        return mapping[s] || s;
      }
    };

    it('should update the url with new template filenames', function () {
      var content = 'templateUrl: \'views/main.html\',';
      var cp = new AGJSProcessor('', '', content, revvedfinder);
      var awaited = 'templateUrl: \'views/2123.main.html\',';
      assert.equal(awaited, cp.process());
    });

    it('should replace file referenced from root', function () {
      var content = 'templateUrl: \'/views/main.html\',';
      var cp = new AGJSProcessor('', '', content, revvedfinder);
      var awaited = 'templateUrl: \'/views/2123.main.html\',';
      assert.equal(awaited, cp.process());
    });

    it('should not replace the root (i.e /)', function () {
      var content = 'templateUrl: \'/\',';
      var cp = new AGJSProcessor('', '', content, revvedfinder);
      var awaited = 'templateUrl: \'/\',';
      assert.equal(awaited, cp.process());
    });

    it('should not replace external references', function () {
      var content = 'templateUrl: \'http://views/main.html\',';
      var cp = new AGJSProcessor('', '', content, revvedfinder);
      var awaited = 'templateUrl: \'http://views/main.html\',';
      assert.equal(awaited, cp.process());
    });

    it('should take into account relative paths', function () {
      var content = 'templateUrl: \'../../views/main.html\',';
      var cp = new AGJSProcessor('', 'build/css', content, revvedfinder);
      var awaited = 'templateUrl: \'../../views/2123.main.html\',';
      assert.equal(awaited, cp.process());
    });

    it('should not replace not exists template', function () {
      var content = 'templateUrl: \'views/notfound.html\',';
      var cp = new AGJSProcessor('', 'build/css', content, revvedfinder);
      var awaited = 'templateUrl: \'views/notfound.html\',';
      assert.equal(awaited, cp.process());
    });


  });
});
