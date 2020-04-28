const spawn = require("child_process").spawn;

// ask the server for information
var queryServer = function(ip, port=25565, cb) {
    const serverQuery = spawn('python3',["query_server.py", ip, port]);
    let status = {};
    status.online = false;

    serverQuery.stdout.on('data', (data) => {
        status.online = true;
        status.players = {};
        status.players.now = data.toString();
        status.players.max = 20;

        cb(status);
    });
    
    serverQuery.stderr.on('data', (data) => {
        cb(status);
    });
};

exports.queryServer = queryServer;