// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const https = require('https');
const serverIP = 'minecraft.baffqd.com';

var serverlist = [];

var Server = function(ip) {
    let self = {};

    self.ip = ip;

    return self;
};

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
            msg.reply('server starting...');
            toggleServer( () => { msg.reply('server started.') });
        }

        // stop the server
        else if (args == 'stop') {
            msg.reply('server stopping...');
            toggleServer( () => { msg.reply('server stopped.') });
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
    }
});

// send a message to specified channel
var sendMessage = function(channel, content) {
    channel.send(content);
};

// ask the server for information
var queryServer = function(cb) {
    https.get('https://mcapi.us/server/status?ip=' + serverIP, (response) => {
        var data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            data = JSON.parse(data);

            cb(data);
        });
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