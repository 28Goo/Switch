// Libraries
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl');

// Own Exports
const { editEmbed } = require('../src/utils/embeds');
const { playMusic } = require('../src/connect-play');
const { userNotConntected } = require('../src/utils/not-connected');
const { youtube, spotify } = require('../src/utils/hex-values.json');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { setQueue, getSongs, addSongToQueue } = require('../src/queue-system');
const { addCounter } = require('../src/utils/position');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in a voice channel')
		.addStringOption(option => option.setName('query')
			.setDescription('Input a song or URL From Youtube or Spotify')
			.setRequired(true)),
	async execute(interaction) {
		const query = interaction.options.getString('query');
		const position = addCounter();
		const embed = new MessageEmbed();
		const options = { limit: 1 };

		if (userNotConntected(interaction)) return;

		if (play.is_expired()) await play.refreshToken();
		const check = await play.validate(query);

		if (!check) {
			embed.addField('Invalid URL', 'Enter a valid URL', true);
			return interaction.reply({ embeds: [embed] });
		}

		// QUEUE SYSTEM
		// Get query
		// Check if valid URL
		// If valid URL, do the following {
		// Create Map for Queue System with key as connecton and value as queue array
		// check if connection already created in specific guild
		// if no connection: create connection; else: get connection of guild by iterating through the map;
		// } 
		// Get 1st item in Queue of specific guild
		// Run Platform Checker Function and Play Music
		// Check state of Player (if idle, getNextResource)

		const guild = interaction.guild.id;
		const connection = getVoiceConnection(interaction.guild.id);

		if (!connection) {
			const setConnection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.guild.id,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});

			setQueue(guild, setConnection);
		}

		const songs = await addSongToQueue(guild, query);

		if (check === 'yt_video') {
			playMusic(interaction, songs, position);
			const [search] = await play.search(query, options);
			embed.setColor(youtube);
			editEmbed.play(embed, search, interaction);
		}
		else if (check === 'yt_playlist') {
			console.log(`YT PLAYLIST: ${query}`);
			embed.setColor(youtube);
		}
		else if (check === 'sp_track') {
			const track = await play.spotify(query);
			const [search] = await play.search(track.name, options);
			playMusic(interaction, songs, position);
			embed.setColor(spotify);
			editEmbed.play(embed, search, interaction);
		}
		else if (check === 'sp_album') {
			console.log(`SP ALBUM: ${query}`);
			embed.setColor(spotify);
		}
		else if (check === 'sp_playlist') {
			console.log(`SP PLAYLIST: ${query}`);
			embed.setColor(spotify);
		}
		else if (check === 'search') {
			const [search] = await play.search(query, options);
			playMusic(interaction, songs, position);
			embed.setColor('#FF0000');
			editEmbed.play(embed, search, interaction);
		}
		
		if (songs.length > 1) {
			await interaction.reply('Added to Queue');
		}
		else if (query || (songs.length > 1 && !query)) {
			await interaction.reply({ embeds: [embed] });
		}
		// await interaction.reply('Working');
	},
};