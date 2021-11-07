const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const { editEmbed } = require('./utils/embeds');
const hex = require('./utils/hex-values.json');

const queue = new Map();
let position = 0;
let loop = false;
let cleared = false;

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
		cleared = true;
		queue.get(guild).songs = [];

	},
	playNextSong: async (guild, interaction) => {
		position++;
		
		if (cleared === true) {
			position = 0;
			cleared = false;
		}
		const songs = queue.get(guild).songs;

		if (!songs[position + 1] && loop === true) {
			position = 0;
		}
		else if (!songs[position]) {
			queue.get(guild).songs = [];
			position = 0;
			return;
		}

		const connection = getVoiceConnection(guild);
		const player = connection.state.subscription.player;

		let stream;
		if (!songs[position].title) {
			const [song] = await play.search(songs[position].song, { limit:1 });
			stream = await play.stream(song.url);
		}
		else {
			stream = await play.stream(songs[position].url);
		}
		
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
		for (let i = position; i < songs.length; i++) {
			const track = songs[i];
			if (!track.title) {
				if (i === position) embed.addField('Now Playing: ', `[${track.song}](${track.url})`);
				else if (i === position + 1) embed.addField('Next Song:', `[${track.song}](${track.url})`);
				else embed.addField(`${i + 1}.`, `[${track.song}](${track.url})`);
			}
			else if (!track.song) {
				if (i === position) embed.addField('Now Playing: ', `[${track.title}](${track.url})`);
				else if (i === position + 1) embed.addField('Next Song:', `[${track.title}](${track.url})`);
				else embed.addField(`${i + 1}.`, `[${track.title}](${track.url})`);
			}
		}
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