const { MessageEmbed } = require('discord.js')
const model = require('../model')

module.exports = {
	category: 'role_menagement',
	description: '[Admin] Remove role from database',
    permissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'role',
            description: 'Name of the role to remove',
            type: 'ROLE',
            required: true
        }
    ],
	
	slash: true,
	testOnly: true,
	
	callback: async({ interaction, args }) => {
        async function send(embed) {
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
        const role = await interaction.guild.roles.fetch(args[0])
        const guildId = interaction.guildId
        const fancy = new MessageEmbed()
    
        let server = await model.findOne({server: guildId}).exec()
        if(!server) {
            fancy.setTitle('ERROR => Server not found')
            fancy.setDescription(`Please add one role to panel command`)
            fancy.setColor('RED')
            send(fancy)
        } else if(server) {
            let check = server.roles.filter(item => item.name == role.name)
            if(check.length < 1) {
                fancy.setTitle('ERROR => Role not found')
                fancy.setDescription('Please choose the correct role')
                fancy.setColor('RED')
                send(fancy)
            } else {
                let newRoles = server.roles.filter(item => item.name != role.name)
                let temp = {
                    server: guildId,
                    roles: newRoles
                }
                server.overwrite(temp)
                await server.save()
            }
        }

        // mongoose.model('testing-role').findOne({server: guildId}, (err, server) => {
        //     if (err) {
        //         fancy.addField('Event', `Error: ${err}`)
        //         interaction.reply({
        //             embeds: [fancy],
        //             ephemeral: true
        //         })
        //     } else {
        //         let old = server.roles
        //         const check = old.find(x => x.name == role.name)
        //         if (check){
        //             const newList = old.filter(item => item.name != role.name)
        //             server.roles = newList
        //             server.save()
        //             fancy.addField('Event', `Role has been deleted\nRole: ${role.name}`)
        //             interaction.reply({
        //                 embeds: [fancy],
        //                 ephemeral: true
        //             })
        //         } else {
        //             fancy.addField('Event', 'Error: Could not find role')
        //             interaction.reply({
        //                 embeds: [fancy],
        //                 ephemeral: true
        //             })
        //         }
        //     }
        // })
	}
}