// Get requirements for bot to work
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When client is ready, run code below
client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);