const { MessageEmbed } = require('discord.js');
const { editEmbed } = require('./embeds');

module.exports = {
	playMessage: async (interaction, song) => {
		const embed = new MessageEmbed;
		editEmbed.play(embed, song);
		interaction.channel.send({ embeds: [embed] })
		.then(msg => {
			let duration;
			if (!song.durationInSec) duration = song.durationInMs;
			else duration = song.durationInSec * 1000;
			setTimeout(() => {
				msg.delete();
			}, duration);
		});
	},
};