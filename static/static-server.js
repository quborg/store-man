var connect     = require('connect')
  , serveStatic = require('serve-static')
  , path        = require('path')
  , PORT        = 8080

connect().use(serveStatic(path.join(__dirname, 'html'))).listen(PORT, function(){
  console.log('App running on port', PORT);
});
