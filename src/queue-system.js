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
};