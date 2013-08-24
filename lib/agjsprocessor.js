'use strict';

//
// AGJSProcessor takes care, and processes CSS files.
// It is given:
//   - A base directory, which is the directory under which to look at references files
//   - A destination directory, which is the directory under which will be generated the files
//   - A file content to be processed
//   - a file replacement locator
//   - a destination directory (optional)
//   - an optional log callback that will be called as soon as there's something to log
//
var AGJSProcessor = module.exports = function (src, dest, content, revvedfinder, logcb) {
  this.content = content;
  this.filepath = src;
  this.linefeed = /\r\n/g.test(this.content) ? '\r\n' : '\n';
  this.revvedfinder = revvedfinder;
  this.logcb = logcb || function () {};
};

//
// Calls the log callback function
//
AGJSProcessor.prototype.log = function log(msg) {
  this.logcb(msg);
};

// Process the CSS file, which is:
//  - replace image references by their revved version
//
AGJSProcessor.prototype.process = function process() {
    var self = this;
    // Replace reference to images with the actual name of the optimized image
    this.log('Update the templateUrl with reved filenames');
    return this.content.replace(/templateUrl:\s*['"]{1}(.+)['"]{1}\s*/gm, function (match, src) {

      // Consider reference from site root
      var file = self.revvedfinder.find(src, self.filepath + '/../');
      self.log('match:'+ match + ' file:' + file + ' self.filepath: '+ self.filepath);
      var res = match.replace(src, file);

      if (src !== file) {
        self.log(match + ' changed to ' + res);
      }
      return res;
    });
  };
