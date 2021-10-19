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
	playlist: (embed, search, interaction) => {
		embed.setTitle('Playlist Added')
		.setFields(
			{ name: 'Playlist:', value: `[${search.name}](${search.url})`, inline: true },
			{ name: 'Owner:', value: `[${search.owner.name}](${search.owner.url})`, inline:true },
			{ name: 'Track Count:', value: `${search.tracksCount}`, inline: true },
		)
		.setThumbnail(search.thumbnail.url)
		.setFooter(`Added by ${interaction.user.username}`, interaction.user.displayAvatarURL());
	},
	album: (embed, search, interaction) => {
		embed.setTitle('Album Added')
		.setFields(
			{ name: 'Album:', value: `[${search.name}](${search.url})`, inline: true },
			{ name: 'Artist:', value: `[${search.artists[0].name}](${search.artists[0].url})`, inline:true },
			{ name: 'Track Count:', value: `${search.trackCount}`, inline: true },
		)
		.setThumbnail(search.thumbnail.url)
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