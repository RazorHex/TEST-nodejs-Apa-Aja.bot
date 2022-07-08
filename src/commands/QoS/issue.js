const { MessageEmbed } = require('discord.js')

module.exports = {
	category: 'Quality',
	description: 'Report if there is an issue with the bot',
    options: [
        {
            name: 'problem',
            description: 'Give detailed problem that you experience',
            type: 'STRING',
            required: true
        }
    ],
	
	slash: true,
	testOnly: true,
	
	callback: ({ interaction, args, client }) => {
        async function send(embed) {
            log.send({
                embeds: [embed],
            })
            interaction.reply({
                content: 'Issue has been sent!',
                ephemeral: true
            })
        }
		const prob = args[0]
        const channels = interaction.guild.channels.cache
        const log = channels.find(c => c.name === 'issue-log')

        const fancy = new MessageEmbed()
            .setTitle(`NEW Issue`)
            .setDescription(prob)
            .setThumbnail(interaction.user.avatarURL())
            .setFooter({
                text: interaction.user.username,
                iconURL: client.user.avatarURL()
            })
            .setColor('RED')
		
        try {
            send(fancy)
        } catch {
            interaction.reply({
                content: 'Something went wrong, please contact admin',
                ephemeral: true
            })
        }
	},
}