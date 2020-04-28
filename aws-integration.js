const https = require('https');

var isInstanceRunning = function(cb) {
    https.get('https://qfguw5x1u4.execute-api.us-east-2.amazonaws.com/status', resp => {
        var data = '';

        resp.on('data', chunk => {
            data += chunk;
        });

        resp.on('end', () => {
            //data = JSON.parse(data);

            // running or stopped
            cb(data);
        });
    });
};

exports.isInstanceRunning = isInstanceRunning;

// start stop the server
var isActive = function(bool, cb) {
    var result = {};

    isInstanceRunning( status => {

        // turn instance on
        if (bool) {
            if (status != 'stopped') {
                result.status = 'fail';
                result.reason = 'Server is already running.';               
                cb(result);
            } else {
                toggleServer( () => { 
                    result.status = 'success';
                    cb(result);
                });
            }
        }

        // turn instance off
        else {
            if (status != 'running') {
                result.status = 'fail';
                result.reason = 'Server is already stopped.';
                cb(result);
            } else {
                msg.reply('server stopping...');
                toggleServer( () => { 
                    result.status = 'success';
                    cb(result);
                });
            }
        }
    });
};

exports.isActive = isActive;

// turn on/off the server
var toggleServer = function(cb) {
    https.get('https://qfguw5x1u4.execute-api.us-east-2.amazonaws.com/default/startStop-Instance', (resp) => {
        cb();
    });
};