// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const https = require('https');
const serverIP = 'minecraft.baffqd.com';

const spawn = require("child_process").spawn;

var mods = [];

var serverlist = [];

var Server = function(ip) {
    let self = {};

    self.ip = ip;

    return self;
};

var Mod = function(id) {
    let self = {};

    self.id = id;

    return self;
}

mods.push(Mod('295562616447696898'));

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    // when a user says something echo them

    // mahan
    if (msg.author.id == '505756086855532571') {
        msg.reply('that was stupid.');
    }

    // ben
    if (msg.author.username == 'baffqd') {
        //msg.reply('a god has spoken');
    }

    // check if the message sent is a command
    if (msg.content.substring(0,1) == '*') {
        // isolate the arguments
        var args = msg.content.substring(1, msg.content.length).toLowerCase();

        // use hello to introduce craft buddy
        if (args == 'hello') {
            msg.reply('hello! I am CraftBuddy here to assist you!');
            msg.reply('if you have any questions try: *help.');
        }

        // use help to see commands
        else if (args == 'help') {
            msg.reply('stupid.');
        }

        // check the status of the server with *status
        else if (args == 'status') {
            queryServer( status => {
                
                if (status == null) {
                    msg.reply('failed to reach server.');
                }

                else if (status['online']) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Server Status')
                        .setColor(0x00ff00)
                        .setDescription('Online \n' + status['players']['now'] + '/' + status['players']['max']);
                    msg.channel.send(embed);
                }

                else if (!status['online']) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Server Status')
                        .setColor(0xff0000)
                        .setDescription('Offline \n' + '0/20');
                    msg.channel.send(embed);
                }
                
                else {
                    msg.reply('status check failed for an unknown reason.');
                }
            });
        }

        // start the server
        else if (args == 'start') {
            queryServer( data => {
                if (data.online) {
                    msg.reply('the server is already running.');
                } else {
                    msg.reply('server starting...');
                    toggleServer( () => { msg.reply('server started.'); msg.reply('server could take time to load.'); });
                }
            });
        }

        // stop the server
        else if (args == 'stop') {
            queryServer( data => {
                if (!data.online) {
                    msg.reply('the server is already stopped.');
                } else {
                    msg.reply('server stopping...');
                    toggleServer( () => { msg.reply('server stopped.'); msg.reply('server could take time to stop.'); });
                }
            });
        }

        else if (args.substring(0, 3) == 'add') {
            serverlist.push(args.substring(3, args.length));
        }

        // *katie
        else if (args == 'katie') {
            sendMessage(msg.channel, 'ginger');
        }

        // *kasper
        else if (args == 'kasper') {
            sendMessage(msg.channel, 'my dad');
        }




        // REQUIRES MOD PRIVILAGES

        else if (args.substring(0, 12) == 'add-response') {
            console.log('hello');
        }

        else {
            msg.reply('command not found.');
        }
    }
});

// send a message to specified channel
var sendMessage = function(channel, content) {
    channel.send(content);
};

// ask the server for information
var queryServer = function(cb) {
    const serverQuery = spawn('python3',["query_server.py"]);
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

// get the current status of the server - true or false
var getStatus = function(cb) {
    queryServer( data => {
        status = data["online"];
        cb(status);
    });
};

// turn on/off the server
var toggleServer = function(cb) {
    https.get('https://qfguw5x1u4.execute-api.us-east-2.amazonaws.com/default/startStop-Instance', (resp) => {
        cb();
    });
};

client.login(process.env.DISCORD_TOKEN);