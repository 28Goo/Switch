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

		await interaction.deferReply();

		if (!check) {
			editEmbed.invalidUrl(embed);
			await interaction.followUp({ embeds: [embed] });
			return;
		}


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

		let search, playlist;

		if (check === 'yt_video' || check === 'search') {
			addSongToQueue(guild, query);
			[search] = await play.search(query, { limit:1 });
		}
		// else if (check === 'yt_playlist') {
		// }
		else if (check === 'sp_track') {
			const track = await play.spotify(query);
			const songDetails = `${track.name} ${track.artists[0].name}`;
			addSongToQueue(guild, songDetails);
			[search] = await play.search(songDetails, { limit:1 });
		}
		else if (check === 'sp_playlist' || check === 'sp_album') {
			playlist = await play.spotify(query);
			const tracks = playlist.page(1);
			for (const track of tracks) {
				const songDetails = `${track.name} ${track.artists[0].name}`;
				addSongToQueue(guild, songDetails);
			}
		}
		
		const songs = getSongs(guild);

		if (songs.length === 1) {
			editEmbed.play(embed, search, interaction);
			await playMusic(interaction);
		}
		else if (check === 'sp_playlist') {
			editEmbed.playlist(embed, playlist, interaction);
			await playMusic(interaction);
		}
		else if (check === 'sp_album') {
			editEmbed.album(embed, playlist, interaction);
			await playMusic(interaction);
		}
		else if (!playlist) {
			editEmbed.invalidUrl(embed);
			await interaction.followUp({ embeds: [embed] });
			return;
		}

		else if (songs.length > 1 && check !== 'sp_playlist') {
			editEmbed.addedToQueue(embed, search, interaction);
		}

		await interaction.followUp({ embeds: [embed] });
	},
};