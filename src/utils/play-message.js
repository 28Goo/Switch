const { MessageEmbed } = require('discord.js');
const { editEmbed } = require('./embeds');

module.exports = {
	playMessage: (interaction, song) => {
		const embed = new MessageEmbed;
		editEmbed.play(embed, song);
		interaction.channel.send({ embeds: [embed] })
		.then(msg => {
			setTimeout(() => {
				msg.delete();
			}, song.duration);
		});
	},
};