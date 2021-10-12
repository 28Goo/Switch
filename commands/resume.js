const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const { editEmbed } = require('../src/utils/embeds');
const { userNotConntected, botNotConnected } = require('../src/utils/not-connected');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume music.'),
	async execute(interaction) {
		if (userNotConntected(interaction)) return;

		const connection = getVoiceConnection(interaction.guild.id);

		if (botNotConnected(interaction, connection)) return;

		const player = connection.state.subscription.player;
		connection.subscribe(player);
		player.unpause();

		const embed = new MessageEmbed();
		editEmbed.resume(embed, interaction);
		await interaction.reply({ embeds: [embed] });
	},
};