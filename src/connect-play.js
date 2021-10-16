const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');
const { execute } = require('../commands/play');

module.exports.playMusic = async (interaction, queue, position) => {
	console.log('Working');

	const stream = await play.stream(queue[position]);

	const connection = getVoiceConnection(interaction.guild.id);

	// const playerState = connection.state.subscription.player;
	// console.log(playerState);

	const resource = createAudioResource(stream.stream, {
		inputType: stream.type,
	});
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Play,
		},
	});

	if (queue.length > 1) return;
	
	player.on('stateChange', (oldState, newState) => {
		console.log(`Switch transitioned from ${oldState.status} to ${newState.status}`);

		if (oldState === 'playing' && newState === 'idle') {
			execute(interaction);
		}
	});

	player.play(resource);
	connection.subscribe(player);

	
};