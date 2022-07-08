const { Client, CommandInteraction } = require('discord.js')

module.exports = {
	category: 'Testing',
	description: 'Replies with pong',
	
	slash: true,
	testOnly: true,
	
	callback: ({ interaction }) => {
		const reply = 'Pong!'
		
		interaction.reply({
			content: reply
		})
	},
}