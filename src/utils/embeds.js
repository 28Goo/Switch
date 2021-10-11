module.exports.addEmbed = {
	play: (embed, searched, interaction) => {
		embed.setTitle('Now Playing')
		.setDescription(`[${searched.title}](${searched.url})`)
		.addFields(
			{ name: 'Duration:', value: searched.durationRaw, inline:true },
			{ name: 'Channel:', value: `[${searched.channel.name}](${searched.channel.url})`, inline:true },
			{ name: 'Queued by:', value: `${interaction.member}`, inline:true },
		)
		.setThumbnail(searched.channel.icon.url)
		.setImage(searched.thumbnail.url);
	},
	error: (embed) => {
		embed.setDescription('There was an error while executing the command.');
	},
};