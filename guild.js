var url = "mongodb://localhost:27017/mydb";
var mongoClient = require('mongodb').MongoClient;

var guilds = {};

var createGuild = function(id) {

    if (guilds[id] != undefined) {
        console.log('GuildManager: guild creation failed: guild exists');
        return;
    }

    let self = {};

    self.id = id;

    self.servers = [];
    self.mods = [];

    guilds[id] = self;
    saveGuild(self);
};
exports.createGuild = createGuild;

var Server = function(ip, port) {
    let self = {};

    self.ip = ip;
    self.port = port;

    return self;
};

var addServer = function(id, options={}) {
    let ip = options.ip;
    let port = options.port;

    if (port === undefined) {
        port = 25565;
    }

    let server = Server(ip, port);
    guilds[id].servers.push(server);
};
exports.addServer = addServer;

var loadAll = function(cb) {
    mongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb");

        var query = {};
        dbo.collection('guilds').find(query).toArray(function(err, results) {
            if (err) throw err;
            
            for(var i = 0; i < results.length; i++) {
                let result = results[i];
                if (guilds[result.id] === undefined) {
                    guilds[result.id] = result;
                }
            }

            db.close();
        });
    });
};

exports.loadAll = loadAll;

var saveGuild = function(guild=Guild('')) {   

    if(guild.id == undefined)
        return;
    
    mongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb");

        var query = { id: guild.id };
        dbo.collection('guilds').find(query).toArray(function(err, result) {
            if (err) throw err;

            if (result.length == 0) {
                dbo.collection('guilds').insertOne( guild, function(err, res) {
                    if (err) console.log(err);

                    console.log('inserted guild with id: ' + guild.id);

                    db.close();
                });
            } else {

                // UPDATE THE INFORMATION

            }

            db.close();
        });
    });
};

async function updateAll(cb) {
    return new Promise ((res, rej) => {
        mongoClient.connect(url, async function(err, db) {
            var dbo = db.db("mydb");

            let guildObjs = Object.values(guilds);

            for (var i = 0; i , guildObjs.length; i++) {
                if (guildObjs[i] === undefined)
                    continue;
                await updateOne(guildObjs[i]);
            }

            res();
            cb();

            db.close();
        });
    });
};
exports.updateAll = updateAll;

var updateOne = async function(guild) {
    return new Promise ((resolution , rej) => {
        mongoClient.connect(url, function(err, db) {
            var dbo = db.db("mydb");
            dbo.collection('guilds').replaceOne( { id: guild.id }, guild, { upsert: true }, (err, res) => {
                if (err) console.log(err);

                console.log('updated guild with id: ' + guild.id);
                resolution();

                db.close();
            }); 
        });
    });
};

// pulls guild document
var pullGuild = function(id, cb) {
    mongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb");

        var query = { id: id };
        dbo.collection('guilds').find(query).toArray(function(err, result) {
            if (err) console.log(err);

            let firstRes = result[0];
            
            cb(firstRes);

            db.close();
        });
    });
};

// returns locally held copy of guild obj
var getGuild = function(id) {
    var res = guilds[id];

    console.log(res);

    return res;
};

exports.getGuild = getGuild;
