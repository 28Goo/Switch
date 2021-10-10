const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Displays server\'s info.'),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`${interaction.guild.name}`)
			.setThumbnail(`${interaction.guild.iconURL()}`)
			.addFields(
				{ name: 'Members', value: `${interaction.guild.memberCount}` },
			)
			.setTimestamp()
			.setFooter('Footer text');
		await interaction.reply({ embeds: [embed] });
	},
};