const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const play = require('play-dl');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in a voice channel')
		.addStringOption(option => option.setName('song')
			.setDescription('Enter song name')
			.setRequired(true)),
	async execute(interaction) {
		const notConnected = new MessageEmbed()
			.setColor('#00AB08')
			.addFields(
				{ name: 'You are not in a voice channel', value: 'Connect to a voice channel to use Switch.' },
			)
			.setTimestamp();
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [notConnected] });

		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const song = interaction.options.getString('song');
		const data = await play.spotify(song);
		const searched = await play.search(`${data.name}`, { limit: 1 });

		console.log(searched);

		await interaction.reply(`${interaction.member}`);
	},
};