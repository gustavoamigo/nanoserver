/*jslint node: true */
/*jshint -W069 */
/*global describe, it */
var requestParser = require('../http_request_parser.js');
var Stream = require('stream');
var assert = require('assert');


describe('requestParser', function() {
    it('it should parse header without problem', function(done) {
        var stream = new Stream();

        requestParser(stream, function(request) {
            assert.equal(request.method, 'GET');
            assert.equal(request.requestTarget,'/hello.txt');
            assert.equal(request.httpVersion,'HTTP/1.1');
            assert.equal(request.headers['User-Agent'],'curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3');
            assert.equal(request.headers['Host'],'www.example.com');
            assert.equal(request.headers['Accept-Language'],'en, mi');
            done();
        });
        var rawRequest =
            'GET /hello.txt HTTP/1.1\r\n' +
            'User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3\r\n' +
            'Host: www.example.com\r\n' +
            'Accept-Language: en, mi\r\n' +
            '\r\n\r\n';
        stream.emit('data', rawRequest);

    });

    it('it should parse header and handle body stream without problem', function(done) {
        var stream = new Stream();

        requestParser(stream, function(request) {
            assert.equal(request.method, 'GET');
            assert.equal(request.requestTarget,'/hello.txt');
            assert.equal(request.httpVersion,'HTTP/1.1');
            assert.equal(request.headers['User-Agent'],'curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3');
            assert.equal(request.headers['Host'],'www.example.com');
            assert.equal(request.headers['Accept-Language'],'en, mi');
            request.body.on('data', function(data) {
                assert.equal(data.toString(), 'Somebody');
                done();
            });
        });
        var rawRequest =
            'GET /hello.txt HTTP/1.1\r\n' +
            'User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3\r\n' +
            'Host: www.example.com\r\n' +
            'Accept-Language: en, mi\r\n' +
            '\r\n' +
            'Somebody';
        stream.emit('data', rawRequest);
    });

});
