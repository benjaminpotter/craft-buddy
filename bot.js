// Run dotenv
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const https = require('https');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.substring(0,1) == '*') {
        var args = msg.content.substring(1, msg.content.length).toLowerCase();

        if (args == 'status') {
            msg.reply('the server is ' + getStatus() + '.');
        }
        else if (args == 'start') {
            msg.reply('server starting...');
            start();
        }
        else if (args == 'stop') {
            msg.reply('server stopping...');
            stop();
        }
        else if (args == 'katie') {
            msg.reply('ginger');
        }

        client.actions
    }
});

var getStatus = function() {
    return 'offline';
};

var start = function() {
    https.get('https://qfguw5x1u4.execute-api.us-east-2.amazonaws.com/default/startStop-Instance', (resp) => {

    });
};

var stop = function() {
    https.get('https://qfguw5x1u4.execute-api.us-east-2.amazonaws.com/default/startStop-Instance', (resp) => {

    });
};

client.login(process.env.DISCORD_TOKEN);