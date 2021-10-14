const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const play = require('play-dl');

module.exports.playMusic = async (interaction, query) => {
	const stream = await play.stream(query);

	const connection = joinVoiceChannel({
		channelId: interaction.member.voice.channel.id,
		guildId: interaction.guild.id,
		adapterCreator: interaction.guild.voiceAdapterCreator,
	});

	const resource = createAudioResource(stream.stream, {
		inputType: stream.type,
	});
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Play,
		},
	});

	player.play(resource);
	connection.subscribe(player);

	player.on('stateChange', (oldState, newState) => {
		console.log(`Switch transitioned from ${oldState.status} to ${newState.status}`);
	});
};

