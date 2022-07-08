const { MessageEmbed } = require('discord.js')

module.exports = {
	category: 'Quality',
	description: 'Add suggestion to improve the server',
    options: [
        {
            name: 'topic',
            description: 'The topic you would like to add',
            type: 'STRING',
            required: true
        },
        {
            name: 'suggestion',
            description: 'The suggestion you would like to add for this server',
            type: 'STRING',
            required: true
        }
    ],
	
	slash: true,
	testOnly: true,
	
	callback: ({ interaction, args }) => {
        const topic = args[0]
        const suggestion = args[1]
        const fancy = new MessageEmbed()
            .setTitle(topic.toUpperCase())
            .setColor('ORANGE')
            .setDescription(suggestion)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL()
            })
            .setFooter({
                text: `Created at: ${interaction.createdAt.toDateString()}`
            })

        const channel = interaction.guild.channels.cache.find(c => c.name == 'suggest') || null

        try{
            channel.send({
                embeds: [fancy]
            })
            
            interaction.reply({
                content: 'Your suggestion has been send',
                ephemeral: true
            })
        } catch {
            interaction.reply({
                content: 'Something went wrong, please contact admin',
                ephemeral: true
            })
        }
	},
}