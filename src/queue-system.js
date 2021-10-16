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

		return channelQueue.songs;
	},
	getSongs: (guild) => {
		const songs = queue.get(guild).songs;
		return songs;
	},
};