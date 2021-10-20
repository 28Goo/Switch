const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');
const { getSongs, playNextSong } = require('./queue-system');

module.exports.playMusic = async (interaction) => {
	const guild = interaction.guild.id;
	const songs = getSongs(guild);
	const connection = getVoiceConnection(guild);

	const [track] = await play.search(songs[0], { limit: 1 });
	const stream = await play.stream(track.url)
	.catch(async (error) => {
		console.error(error);
		return;
	}); 
	
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
			playNextSong(guild, interaction);
		}
	});

	player.on('error', error => {
		console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
		playNextSong(guild, interaction);
	});
};