module.exports.editEmbed = {
	play: (embed, search, interaction) => {
		embed.setTitle('Now Playing')
		.setDescription(`[${search.title}](${search.url})`)
		.setFields(
			{ name: 'Duration:', value: search.durationRaw, inline:true },
			{ name: 'Channel:', value: `[${search.channel.name}](${search.channel.url})`, inline:true },
			{ name: 'Queued by:', value: `${interaction.user}`, inline:true },
		)
		.setThumbnail(search.channel.icon.url)
		.setImage(search.thumbnail.url);
	},
	addedToQueue: (embed, search, interaction) => {
		embed.setTitle('Added To Queue')
		.setDescription(`[${search.title}](${search.url})`)
		.setFooter(`Added by: ${interaction.user.username}`, interaction.user.displayAvatarURL());
	},
	youtubePlaylist: (embed, playlist, interaction) => {
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
		embed.setDescription(`Switch has been paused by ${inteaction.member}.`);
	},
	resume: (embed, interaction) => {
		embed.setDescription(`Switch has been resumed by ${interaction.member}`);
	},
	skip: (embed, interaction) => {
		embed.setDescription(`Track has been skipped by ${interaction.member}`);
	},
	clear: (embed, interaction) => {
		embed.setDescription(`Switch has been cleared by ${interaction.member}`);
	},
	shuffle: (embed, interaction) => {
		embed.setDescription(`Queue has been shuffled by ${interaction.member}`);
	},
	userNotConnected: (embed) => {
		embed.addField('You are not in a voice channel', 'Connect to a voice channel to use Switch.', true);
	},
	botNotConnected: (embed) => {
		embed.addField('Switch is not connected to a voice channel', 'Use `/play` to connect Switch.');
	},
	invalidUrl: (embed) => {
		embed.addField('Invalid URL', 'Enter a valid URL', true);
	},
	error: (embed) => {
		embed.setColor('#FF0000');
		embed.setDescription('There was an error while executing the command.');
	},
};