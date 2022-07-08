const { Client, CommandInteraction } = require('discord.js')

module.exports = {
	category: 'Testing',
	description: 'Testing event commands',
	
	slash: true,
	testOnly: true,
	
	callback: ({ interaction, client }) => {
        client.emit("guildMemberAdd", interaction.member);
		const reply = 'Emiting event'
		
		interaction.reply({
			content: reply
		})
	},
}