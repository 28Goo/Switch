const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl');
const { addEmbed } = require('../src/utils/embeds');
const { yt } = require('../src/youtube');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in a voice channel')
		.addStringOption(option => option.setName('song')
			.setDescription('Enter song name')
			.setRequired(true)),
	async execute(interaction) {
		const voiceChannel = interaction.member.voice.channel;
		const embed = new MessageEmbed();
		const options = { limit: 1 };

		if (!voiceChannel) {
			embed.addField('You are not in a voice channel', 'Connect to a voice channel to use Switch.', true);
			return interaction.reply({ embeds: [embed] });
		}

		if (play.is_expired()) await play.refreshToken();

		const songs = [];
		const song = interaction.options.getString('song');
		songs.push(song);
		const check = await play.validate(song);

		if (!check) {
			embed.addField('Invalid URL', 'Enter a valid URL', true);
			return interaction.reply({ embeds: [embed] });
		}
		else if (check === 'yt_video') {
			const video = await play.video_basic_info(song);
			const [searched] = await play.search(video.video_details.title, options);
			yt(interaction, searched);
			embed.setColor('#FF0000');
			addEmbed.play(embed, searched, interaction);
		}
		else if (check === 'yt_playlist') {
			console.log(`YT PLAYLIST: ${song}`);
		}
		else if (check === 'sp_track') {
			console.log(`SP TRACK: ${song}`);
		}
		else if (check === 'sp_album') {
			console.log(`SP ALBUM: ${song}`);
		}
		else if (check === 'sp_playlist') {
			console.log(`SP PLAYLIST: ${song}`);
		}
		else if (check === 'search') {
			const [searched] = await play.search(song, options);
			yt(interaction, searched);
			embed.setColor('#FF0000');
			addEmbed.play(embed, searched, interaction);
		}
		
		await interaction.reply({ embeds: [embed] });
		// await interaction.reply('Working');
	},
};