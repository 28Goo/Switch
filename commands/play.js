// Libraries
const { MessageEmbed } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl');

// Own Exports
const { editEmbed } = require('../src/utils/embeds');
const { userNotConntected } = require('../src/utils/not-connected');
const { setQueue, getSongs, addSongToQueue } = require('../src/queue-system');
const { playMusic } = require('../src/connect-play');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in a voice channel')
		.addStringOption(option => option.setName('query')
			.setDescription('Input a song or URL From Youtube or Spotify')
			.setRequired(true)),
	async execute(interaction) {
		const query = interaction.options.getString('query');
		const embed = new MessageEmbed();

		if (userNotConntected(interaction)) return;

		if (play.is_expired()) await play.refreshToken();

		const check = await play.validate(query);

		if (!check) {
			embed.addField('Invalid URL', 'Enter a valid URL', true);
			interaction.reply({ embeds: [embed] });
			return;
		}

		await interaction.deferReply();

		const guild = interaction.guild.id;
		let connection = getVoiceConnection(interaction.guild.id);

		if (!connection) {
			connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});

			setQueue(guild, connection);
		}

		const options = { limit: 1 };

		let search;
		let playlist;

		if (check === 'yt_video') {
			[search] = await play.search(query, options);
			addSongToQueue(guild, search.url);
		}
		// else if (check === 'yt_playlist') {
		// }
		else if (check === 'sp_track') {
			const track = await play.spotify(query);
			[search] = await play.search(`${track.name} ${track.artists[0].name}`, options);
			addSongToQueue(guild, search.url);
		}
		// else if (check === 'sp_album') {
		// }
		else if (check === 'sp_playlist') {
			playlist = await play.spotify(query);
			const tracks = playlist.page(1);
			for (const track of tracks) {
				const [data] = await play.search(`${track.name} ${track.artists[0].name}`, options);
				addSongToQueue(guild, data.url);
			}
		}
		else if (check === 'search') {
			[search] = await play.search(query, options);
			addSongToQueue(guild, search.url);
		}
		
		const songs = getSongs(guild);
		console.log(songs);
		
		if (songs.length === 1) {
			await playMusic(interaction, songs);
			editEmbed.play(embed, search, interaction);
		}
		else if (check === 'sp_playlist') {
			await playMusic(interaction, songs);
			editEmbed.playlist(embed, playlist, interaction);
		}
		else if (songs.length > 1 && check !== 'sp_playlist') {
			editEmbed.addedToQueue(embed, search, interaction);
		}

		await interaction.followUp({ embeds: [embed] });
	},
};