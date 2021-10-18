const play = require('play-dl');
const { addSongToQueue } = require('../queue-system');

module.exports = {
	getCheckedQuery: async (interaction, query) => {
		const check = await play.validate(query);
		let search;
		const options = { limit: 1 };

		if (check === 'yt_video') {
			[search] = await play.search(query, options);
		}
		// else if (check === 'yt_playlist') {
		// }
		else if (check === 'sp_track') {
			const track = await play.spotify(query);
			[search] = await play.search(`${track.name} ${track}`, options);
		}
		// else if (check === 'sp_album') {
		// }
		else if (check === 'sp_playlist') {
			search = await play.spotify(query);
			const tracks = search.page(1);
			for (const track of tracks) {
				const url = await play.search(track.name, options);
				addSongToQueue(interaction.guild.id, url);
			}
		}
		else if (check === 'search') {
			[search] = await play.search(query, options);
		}

		return search;
	},
};