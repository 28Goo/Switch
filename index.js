// Get requirements for bot to work
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const { editEmbed } = require('./src/utils/embeds');

// Create client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_VOICE_STATES,
] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	// Get file
	const command = require(`./commands/${file}`);
	// Get command from file and add to collection
	client.commands.set(command.data.name, command);
}

// When client is ready, run code below
client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		interaction.deferReply();
		await command.execute(interaction);
	}
	catch (error) {
		console.error(`Index Error: ${error}`);
		const embed = new MessageEmbed();
		editEmbed.error(embed);
		await interaction.followUp({ embeds: [embed] });
	}
});

client.login(token);