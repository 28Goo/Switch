const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel } = require('@discordjs/voice');
const play = require('play-dl');

module.exports.yt = async (interaction, searched) => {
	const stream = await play.stream(searched.url);

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
};
