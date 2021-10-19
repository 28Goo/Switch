const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const { clearQueue, getSongs } = require('./queue-system');
const { editEmbed } = require('./utils/embeds');

const embed = new MessageEmbed();

let position = 0;

module.exports.playMusic = async (interaction, songs) => {

	const connection = getVoiceConnection(interaction.guild.id);

	const [track] = await play.search(songs[position], { limit: 1 });

	const stream = await play.stream(track.url);
	
	const resource = createAudioResource(stream.stream, {
		inputType: stream.type,
	});

	const player = createAudioPlayer({
		behaviors: NoSubscriberBehavior.Play,
	});
	
	player.play(resource);

	connection.subscribe(player);

	player.on('stateChange', async (oldState, newState) => {
		console.log(`Switch transitioned from ${oldState.status} to ${newState.status}`);

		if (oldState.status === 'playing' && newState.status === 'idle') {
			const queue = getSongs(interaction.guild.id);
			position++;

			if (!queue[position]) {
				position = 0;
				clearQueue(interaction.guild.id);
				return;
			}

			this.playMusic(interaction, queue);
			const [nextTrack] = await play.search(queue[position], { limit: 1 });
			editEmbed.play(embed, nextTrack, interaction);
			
			interaction.fetchReply()
			.then(reply => reply.edit({ embeds: [embed] }));
		}
	});
};