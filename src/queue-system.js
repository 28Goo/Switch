const play = require('play-dl');
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
	addSongToQueue: async (guild, query) => {
		const channelQueue = queue.get(guild);

		const check = await play.validate(query);

		if (check === 'yt_video' || check === 'search') {
			const [search] = await play.search(query, { limit: 1 });
			channelQueue.songs.push(search.url);
		}
		else if (check === 'sp_track') {
			const track = await play.spotify(query);
			const [search] = await play.search(track.name, { limit: 1 });
			channelQueue.songs.push(search.url);
		}
		return channelQueue.songs;
	},
	getSongs: async (guild) => {
		const songs = queue.get(guild).songs;
		return songs;
	},
};