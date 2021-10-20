const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const { editEmbed } = require('../src/utils/embeds');
const { userNotConntected, botNotConnected } = require('../src/utils/not-connected');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnects Switch from the voice channel.'),
	async execute(interaction) {
		await interaction.deferReply();
		
		const connection = getVoiceConnection(interaction.guild.id);
		if (userNotConntected(interaction)) return;
		if (botNotConnected(interaction, connection)) return;

		connection.destroy();

		const embed = new MessageEmbed();
		editEmbed.disconnect(embed, interaction);
		await interaction.followUp({ embeds: [embed] });
	},
};