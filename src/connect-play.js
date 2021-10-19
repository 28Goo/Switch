const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const play = require('play-dl');
const { getSongs } = require('./queue-system');
const { editEmbed } = require('./utils/embeds');

const embed = new MessageEmbed();

module.exports.playMusic = async (interaction) => {
	const guild = interaction.guild.id;
	const songs = getSongs(guild);
	const connection = getVoiceConnection(guild);

	const [track] = await play.search(songs[0], { limit: 1 });

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
			const queue = getSongs(guild);
			queue.shift();
			
			if (!queue[0]) {
				player.stop();
				return;
			}

			this.playMusic(interaction, queue);
			const [nextSong] = await play.search(songs[0], { limit: 1 });
			editEmbed.play(embed, nextSong, interaction);
			interaction.channel.send({ embeds: [embed] });
		}
	});
};