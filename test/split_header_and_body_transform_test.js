/*jslint node: true */
/*global describe, it */

var assert = require('assert');
var SplitHeaderAndBodyTransform = require('../split_header_and_body_transform.js');
var Stream = require('stream');

describe('SplitHeaderAndBodyTransform', function() {
    it('It should split header and body without problems', function(done) {
        var transform = new SplitHeaderAndBodyTransform();
        var stream = new Stream();
        var expected = 2;
        var checkDone = function() {
            expected--;
            if (expected === 0) {
                done();
            }
        };

        transform.once('header', function(header) {
            assert.equal(header, 'Header\r\n');
            checkDone();
        });

        transform.on('data', function(data) {
            assert.equal(data.toString(), 'Body');
            checkDone();
        });

        stream.pipe(transform);
        stream.emit('data', 'Header\r\n\r\nBody');
    });


    it('It should split multiple line header and body without problems', function(done) {
        var transform = new SplitHeaderAndBodyTransform();
        var stream = new Stream();
        transform.on('data', function(data) {
            assert.equal(data.toString(), 'Somebody');
            done();
        });

        stream.pipe(transform);

        var rawRequest =
            'GET /hello.txt HTTP/1.1\r\n' +
            'User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3\r\n' +
            'Host: www.example.com\r\n' +
            'Accept-Language: en, mi\r\n' +
            '\r\n' +
            'Somebody';
        stream.emit('data', rawRequest);
    });


    it('It should split message with multiple chuncks', function(done) {
        var transform = new SplitHeaderAndBodyTransform();
        var stream = new Stream();
        transform.on('data', function(data) {
            assert.equal(data.toString(), 'Somebody');
            done();
        });

        stream.pipe(transform);

        stream.emit('data', 'GET /hello.txt HTTP/1.1\r\n');
        stream.emit('data', 'User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3\r\n');
        stream.emit('data', 'Host: www.example.com\r\n');
        stream.emit('data', 'Accept-Language: en, mi\r\n');
        stream.emit('data', '\r\n');
        stream.emit('data', 'Somebody');
    });

    it('It should split header and body with a stream without body without problems', function(done) {
        var transform = new SplitHeaderAndBodyTransform();
        var stream = new Stream();

        transform.once('header', function(header) {
            assert.equal(header, 'Header data\r\nSome header\r\nStill Header data\r\n');
            done();
        });
        stream.pipe(transform);
        stream.emit('data', 'Header data\r\nSome header\r\nStill Header data\r\n\r\n');
    });
});
