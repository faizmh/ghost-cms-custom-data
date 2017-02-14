var hbs = require('express-hbs');

module.exports = function() {  
  hbs.registerHelper('bl', function (node, post) {
    var content = post.data.root.post.html;
    var regexstring = '<bl_' + node + '>[\\s\\S]*?<\/bl_' + node + '>';
    var regexp = new RegExp(regexstring, "gm");
    if(content.match(regexp)) {
      var match = content.match(regexp)[0]
      match = match.replace('<bl_' + node + '>', '');
      match = match.replace('</bl_' + node + '>', '');
      return new hbs.SafeString(match);
    } else {
      return '';
    }
  })
}