const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const { editEmbed } = require('./utils/embeds');

const queue = new Map();

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
		songs.shift();
		
		if (!songs[0]) {
			return;
		}

		const connection = getVoiceConnection(guild);
		const player = connection.state.subscription.player;

		const [track] = await play.search(songs[0], { limit: 1 });
		const stream = await play.stream(track.url);
		
		const resource = createAudioResource(stream.stream, {
			inputType: stream.type,
		});

		player.play(resource);

		const embed = new MessageEmbed();
		editEmbed.play(embed, track, interaction);
		interaction.channel.send({ embeds: [embed] });	
	},
};