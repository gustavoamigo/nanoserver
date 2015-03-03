#Nanoserver: A Minimum Experimental Web Server in node.js

This is a bare minimum implementation of an HTTP Server to serve static files.
I created this project to study the basic features of node.js, while learning
a little bit more about the HTTP protocol (see [ rfc7230](https://tools.ietf.org/html/rfc7230)). Therefore, it
does not use the [http](http://nodejs.org/api/http.html) module from node.js.
So, you can say that this is reinventing the wheel, but that's what you do
when you want to learn a little bit more about stuff.

## The server
To start the server.

    var http = require('./http_static_file_server.js');

    http.createServer({rootPath: './sample-site'})
        .listen(8124, function() {
            console.log('Server listening to port 8124');
        });


## Code

The [http_static_file_server.js](http_static_file_server.js) implements the Web Server
to serve static files. It inherits [http_server.js](http_server.js), which implements
part of the HTTP request/response protocol. It uses a request parser [http_request_parser.js](http_request_parser.js), which implements a very simple parser. It should parse almost any http request, but it does not validate it against the full specification. It parses the following rules:

    HTTP-message = request-line *( header-field CRLF ) CRLF [ message-body
    ]
    request-line = method SP request-target SP HTTP-version CRLF
    request-target = absolute-path [ "?" query ]

The request parser uses a Transform Stream (see [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform_1)) to split the header from the body. This Transform Stream is in [split_header_body_transform.js](split_header_body_transform.js).

The response is created using [http_response_builder.js](http_response_builder.js).

I think the rest of the code should speak for itself. I created some test using mocha, which should help understanding the code. 

## License
The whole thing is lincesed under MIT License.
