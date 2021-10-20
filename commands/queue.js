const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { getSongs } = require('../src/queue-system');
const { userNotConntected, botNotConnected } = require('../src/utils/not-connected');
const play = require('play-dl');
const { MessageEmbed } = require('discord.js');
const { editEmbed } = require('../src/utils/embeds');

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
		const queue = [];

		for (const song of songs) {
			const [search] = await play.search(song, { limit: 1, source: { 'spotify': 'track' } });
			const track = {
				title: { name: search.name, url: search.url },
				artist: { name: search.artists[0].name, url: search.artists[0].url },
			};
			queue.push(track);
		}
		
		const embed = new MessageEmbed();
		editEmbed.queue(embed, queue);
		await interaction.followUp({ embeds: [embed] });
	},
};