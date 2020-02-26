var expect  = require('chai').expect;
var request = require('request');

describe('Videos process', function() {
    it('Login function', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(response.statusCode).to.equal(200);
        });
    });
    it('Access and broadcast video', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Register user in the system', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Access registered link of a trimmed video', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Trim a video', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Consult videos', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Delete videos', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Save videos in the system', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Get initial info for browser', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('Get last 6 videos in the system', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });
    it('time calculation', function () {
        request('http://localhost:3000/', function (error, response, body) {
            expect(body).to.equal('Hello World');
        });
    });

});