const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const { editEmbed } = require('../src/utils/embeds');
const { userNotConntected, botNotConnected } = require('../src/utils/not-connected');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips current track'),
	async execute(interaction) {
		if (userNotConntected(interaction)) return;

		const guild = interaction.guild.id;
		const connection = getVoiceConnection(guild);

		if (botNotConnected(interaction, connection)) return;

		await interaction.deferReply();
		
		const player = connection.state.subscription.player;
		player.stop();
		connection.subscribe(player);

		const embed = new MessageEmbed();
		editEmbed.skip(embed, interaction);
		await interaction.followUp({ embeds: [embed] });
	},
};