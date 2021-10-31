const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { getSongs, getQueue } = require('../src/queue-system');
const { userNotConntected, botNotConnected } = require('../src/utils/not-connected');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Checks queue'),
	async execute(interaction) {
		await interaction.deferReply();

		const guild = interaction.guild.id;
		const connection = getVoiceConnection(guild);
		if (userNotConntected(interaction)) return;
		if (botNotConnected(interaction, connection)) return;
		
		const songs = getSongs(guild);
		const embed = new MessageEmbed();
		getQueue(songs, embed);
		await interaction.followUp({ embeds: [embed] });
	},
};