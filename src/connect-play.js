const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');
const { playNextSong, getQueue } = require('./queue-system');
const { playMessage } = require('./utils/play-message');

module.exports.playMusic = async (interaction) => {
	const guild = interaction.guild.id;
	const queue = getQueue(guild);
	const connection = getVoiceConnection(guild);

	let stream;
	if (!queue[0].title) {
		const [song] = await play.search(queue[0].song, { limit:1 });
		stream = await play.stream(song.url)
		.catch(async (error) => {
			console.log(error);
			playNextSong(guild, interaction);
		});
	}
	else {
		stream = await play.stream(queue[0].url);
	}
	
	const resource = createAudioResource(stream.stream, {
		inputType: stream.type,
	});

	const player = createAudioPlayer({
		behaviors: NoSubscriberBehavior.Play,
	});

	player.play(resource);
	connection.subscribe(player);

	playMessage(interaction, queue[0]);

	player.on('stateChange', async (oldState, newState) => {
		console.log(`Switch transitioned from ${oldState.status} to ${newState.status}`);

		if (oldState.status === 'playing' && newState.status === 'idle') {
			playNextSong(guild, interaction);
		}
	});

	player.on('error', error => {
		console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
	});
};