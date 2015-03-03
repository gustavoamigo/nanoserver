/*jslint node: true */
'use strict';

var http = require('../http_static_file_server.js');

http.createServer({rootPath: './sample-site'})
    .listen(8124, function() {
        console.log('Server listening to port 8124');
    });
