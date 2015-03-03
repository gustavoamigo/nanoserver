/*jslint node: true */
'use strict';

var http = require('../http_server.js');

http.createServer(function (request, response) {
    response.headers['Content-Type'] = 'text/html; charset=utf-8';
    response.end('<html><body>hello world</body></html>');
}).listen(8124, function() {
    console.log('Server listening to port 8124');
});
