const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const { editEmbed } = require('./utils/embeds');
const hex = require('./utils/hex-values.json');

const queue = new Map();
let position = 0;

module.exports = {
	setQueue: (guild, connection) => {
		const sourceChannel = { 
			voiceChannel: connection,
			songs: [],
		};

		queue.set(guild, sourceChannel);
		return queue;
	},
	addSongToQueue: (guild, song) => {
		const channelQueue = queue.get(guild);
		channelQueue.songs.push(song);
	},
	getSongs: (guild) => {
		const songs = queue.get(guild).songs;
		return songs;
	},
	clearQueue: (guild) => {
		const channelSongs = queue.get(guild);
		channelSongs.songs = [];
	},
	playNextSong: async (guild, interaction) => {
		const songs = queue.get(guild).songs;
		if (!songs[0]) return;
		
		position++;
		const connection = getVoiceConnection(guild);
		const player = connection.state.subscription.player;
		const stream = await play.stream(songs[position].url);
		
		const resource = createAudioResource(stream.stream, {
			inputType: stream.type,
		});

		player.play(resource);

		const embed = new MessageEmbed();
		editEmbed.play(embed, songs[position], interaction);
		interaction.channel.send({ embeds: [embed] });	
	},
	getQueue: (songs, embed) => {
		embed.setColor(hex.default);
		embed.setTitle('Queue');
		if (!songs[0]) {
			embed.setDescription('Queue is empty');
			return;
		}
		songs.forEach((track, index) => {
			if (index === position) embed.addField('Now Playing: ', `[${track.title}](${track.url})`);
			else if (index === position + 1) embed.addField('Next Song:', `[${track.title}](${track.url})`);
			else embed.addField(`${index + 1}.`, `[${track.title}](${track.url})`);
		});
	},
};