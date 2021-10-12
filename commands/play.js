const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const play = require('play-dl');
const { editEmbed } = require('../src/utils/embeds');
const { playMusic } = require('../src/connect-play');
const { userNotConntected } = require('../src/utils/not-connected');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in a voice channel')
		.addStringOption(option => option.setName('query')
			.setDescription('Input a song or URL From Youtube or Spotify')
			.setRequired(true)),
	async execute(interaction) {
		const query = interaction.options.getString('query');
		
		const embed = new MessageEmbed();
		const options = { limit: 1 };

		if (userNotConntected(interaction)) return;

		if (play.is_expired()) await play.refreshToken();

		const queries = [];
		queries.push(query);
		const check = await play.validate(query);

		if (!check) {
			embed.addField('Invalid URL', 'Enter a valid URL', true);
			return interaction.reply({ embeds: [embed] });
		}
		else if (check === 'yt_video') {
			playMusic(interaction, query);
			const [search] = await play.search(query, options);
			embed.setColor('#FF0000');
			editEmbed.play(embed, search, interaction);
		}
		else if (check === 'yt_playlist') {
			console.log(`YT PLAYLIST: ${query}`);
		}
		else if (check === 'sp_track') {
			const track = await play.spotify(query);
			const [search] = await play.search(track.name, options);
			playMusic(interaction, search.url);
			editEmbed.play(embed, search, interaction);
		}
		else if (check === 'sp_album') {
			console.log(`SP ALBUM: ${query}`);
		}
		else if (check === 'sp_playlist') {
			console.log(`SP PLAYLIST: ${query}`);
		}
		else if (check === 'search') {
			const [search] = await play.search(query, options);
			playMusic(interaction, search.url);
			embed.setColor('#FF0000');
			editEmbed.play(embed, search, interaction);
		}
		
		await interaction.reply({ embeds: [embed] });
		// await interaction.reply('Working');
	},
};