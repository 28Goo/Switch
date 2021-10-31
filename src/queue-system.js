const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const { editEmbed } = require('./utils/embeds');
const hex = require('./utils/hex-values.json');

const queue = new Map();
let position = 0;
let loop = false;

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
	getQueue: (guild) => {
		const songs = queue.get(guild).songs;
		return songs;
	},
	clearQueue: (guild) => {
		queue.get(guild).songs = [];
		position = 0;
	},
	playNextSong: async (guild, interaction) => {
		position++;
		const songs = queue.get(guild).songs;
		
		if (!songs[position] && loop === true) {
			position = 0;
		}
		else if (!songs[position]) {
			queue.get(guild).songs = [];
			return;
		}
		
		const connection = getVoiceConnection(guild);
		const player = connection.state.subscription.player;
		const stream = await play.stream(songs[position].url);
		
		const resource = createAudioResource(stream.stream, {
			inputType: stream.type,
		});

		player.play(resource);

		const embed = new MessageEmbed();
		editEmbed.play(embed, songs[position]);
		interaction.channel.send({ embeds: [embed] });
	},
	presentQueue: (guild) => {
		const embed = new MessageEmbed();
		const songs = queue.get(guild).songs;
		embed.setColor(hex.default);
		embed.setTitle('Queue');
		if (!songs[0]) {
			embed.setDescription('Queue is empty');
			return embed;
		}
		songs.forEach((track, index) => {
			if (index === position) embed.addField('Now Playing: ', `[${track.title}](${track.url})`);
			else if (index === position + 1) embed.addField('Next Song:', `[${track.title}](${track.url})`);
			else embed.addField(`${index + 1}.`, `[${track.title}](${track.url})`);
		});
		return embed;
	},
	loopQueue: (interaction) => {
		const embed = new MessageEmbed();
		if (loop === true) {
			loop = false;
			editEmbed.stopLoop(embed, interaction);
			interaction.followUp({ embeds: [embed] });
			return;
		}
		loop = true;
		editEmbed.loop(embed, interaction);
		interaction.followUp({ embeds: [embed] });
	},
};