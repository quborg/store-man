var connect = require('connect');
var serveStatic = require('serve-static');
const PORT = 7777

connect().use(serveStatic(__dirname)).listen(PORT, function(){
    console.log('Server running on port', PORT);
});
