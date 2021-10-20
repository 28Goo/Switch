const hex = require('./hex-values.json');

module.exports.editEmbed = {
	play: (embed, search) => {
		embed.setColor(hex.default);
		embed.setTitle('Now Playing')
		.setDescription(`[${search.title}](${search.url})`)
		.setFields(
			{ name: 'Duration:', value: search.durationRaw, inline:true },
			{ name: 'Channel:', value: `[${search.channel.name}](${search.channel.url})`, inline:true },
		)
		.setThumbnail(search.thumbnail.url);
	},
	addedToQueue: (embed, search, interaction) => {
		embed.setColor(hex.default);
		embed.setTitle('Added To Queue')
		.setDescription(`[${search.title}](${search.url})`)
		.setFooter(`Added by: ${interaction.user.username}`, interaction.user.displayAvatarURL());
	},
	youtubePlaylist: (embed, playlist, interaction) => {
		embed.setColor(hex.youtube);
		embed.setTitle('Youtube Playlist Added')
			.setFields(
				{ name: 'Playlist:', value: `[${playlist.title}](${playlist.url})`, inline: true },
				{ name: 'Channel:', value: `[${playlist.channel.name}](${playlist.channel.url})`, inline: true },
				{ name: 'Track Count:', value: `${playlist.videoCount}`, inline: true },
			)
			.setThumbnail(playlist.thumbnail.url)
			.setFooter(`Added by ${interaction.user.username}`, interaction.user.displayAvatarURL());
	},
	spotifyPlaylist: (embed, playlist, interaction) => {
		embed.setColor(hex.spotify);
		embed.setTitle('Spotify Playlist Added')
			.setFields(
				{ name: 'Playlist:', value: `[${playlist.name}](${playlist.url})`, inline: true },
				{ name: 'Owner:', value: `[${playlist.owner.name}](${playlist.owner.url})`, inline:true },
				{ name: 'Track Count:', value: `${playlist.tracksCount}`, inline: true },
			)
			.setThumbnail(playlist.thumbnail.url)
			.setFooter(`Added by ${interaction.user.username}`, interaction.user.displayAvatarURL());
	},
	spotifyAlbum: (embed, album, interaction) => {
		embed.setColor(hex.spotify);
		embed.setTitle('Spotify Album Added')
			.setFields(
				{ name: 'Album:', value: `[${album.name}](${album.url})`, inline: true },
				{ name: 'Artist:', value: `[${album.artists[0].name}](${album.artists[0].url})`, inline:true },
				{ name: 'Track Count:', value: `${album.trackCount}`, inline: true },
			)
			.setThumbnail(album.thumbnail.url)
			.setFooter(`Added by ${interaction.user.username}`, interaction.user.displayAvatarURL());
	},
	pause: (embed, inteaction) => {
		embed.setColor(hex.pause);
		embed.setDescription(`Switch has been paused by ${inteaction.member}.`);
	},
	resume: (embed, interaction) => {
		embed.setColor(hex.default);
		embed.setDescription(`Switch has been resumed by ${interaction.member}`);
	},
	skip: (embed, interaction) => {
		embed.setColor(hex.skip);
		embed.setDescription(`Track has been skipped by ${interaction.member}`);
	},
	clear: (embed, interaction) => {
		embed.setColor(hex.clear);
		embed.setDescription(`Switch has been cleared by ${interaction.member}`);
	},
	shuffle: (embed, interaction) => {
		embed.setColor(hex.shuffle);
		embed.setDescription(`Queue has been shuffled by ${interaction.member}`);
	},
	queue: (embed, queue) => {
		embed.setColor(hex.default);
		embed.setTitle('Queue');
		if (!queue[0]) {
			embed.setDescription('Queue is empty');
			return;
		}
		for (const track of queue) {
			embed.addField(`${track.title.name}`, `by ${track.artist.name}`);
		}
	},
	userNotConnected: (embed) => {
		embed.setColor(hex.error);
		embed.addField('You are not in a voice channel', 'Connect to a voice channel to use Switch.', true);
	},
	botNotConnected: (embed) => {
		embed.setColor(hex.error);
		embed.addField('Switch is not connected to a voice channel', 'Use `/play` to connect Switch.');
	},
	invalidUrl: (embed) => {
		embed.setColor(hex.error);
		embed.addField('Invalid URL', 'Switch does not support the URL provided.', true);
	},
	error: (embed) => {
		embed.setColor(hex.error);
		embed.setDescription('There was an error while executing the command.');
	},
};