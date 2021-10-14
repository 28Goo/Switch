module.exports.editEmbed = {
	play: (embed, search, interaction) => {
		embed.setTitle('Now Playing')
		.setDescription(`[${search.title}](${search.url})`)
		.addFields(
			{ name: 'Duration:', value: search.durationRaw, inline:true },
			{ name: 'Channel:', value: `[${search.channel.name}](${search.channel.url})`, inline:true },
			{ name: 'Queued by:', value: `${interaction.member}`, inline:true },
		)
		.setThumbnail(search.channel.icon.url)
		.setImage(search.thumbnail.url);
	},
	// playYtSearch: (embed, )
	pause: (embed, inteaction) => {
		embed.setDescription(`Switch has been paused by ${inteaction.member}.`);
	},
	resume: (embed, interaction) => {
		embed.setDescription(`Switch has been resumed by ${interaction.member}`);
	},
	stop: (embed, interaction) => {
		embed.setDescription(`Switch has been cleared by ${interaction.member}`);
	},
	userNotConnected: (embed) => {
		embed.addField('You are not in a voice channel', 'Connect to a voice channel to use Switch.', true);
	},
	botNotConnected: (embed) => {
		embed.addField('Switch is not connected to a voice channel', 'Use `/play` to connect Switch.');
	},
	error: (embed) => {
		embed.setColor('#FF0000');
		embed.setDescription('There was an error while executing the command.');
	},
};