const { MessageEmbed } = require('discord.js');
const { editEmbed } = require('./embeds');

module.exports = {
	playMessage: async (interaction, song) => {
		const embed = new MessageEmbed;
		editEmbed.play(embed, song);
		const msg = await interaction.channel.send({ embeds: [embed] });

		let duration;
		if (!song.durationInSec) duration = song.durationInMs;
		else duration = song.durationInSec * 1000;

		setTimeout(() => {
			msg.delete()
			.catch(error => {
				if (error.code === 1008) console.error('Message already deleted.');
			});
		}, duration);
	},
};