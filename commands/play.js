const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in a voice channel'),
	async execute(interaction) {
		const connectToVoice = new MessageEmbed()
			.setColor('#00AB08')
			.addFields(
				{ name: 'You are not in a voice channel', value: 'Connect to a voice channel to use Switch.' },
			)
			.setTimestamp();
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [connectToVoice] });
		await interaction.reply(`${interaction.member}`);
	},
};