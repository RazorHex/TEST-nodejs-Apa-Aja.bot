const { MessageEmbed } = require('discord.js')
const model = require('../model')

module.exports = {
	category: 'role_management',
	description: '[Admin] Assign a role to a server',

    slash: true,
    Permissions: ['ADMINISTRATOR'],
    options: [
        {
            name: 'role',
            description: 'Role to assign',
            type: 'ROLE',
            required: true,
        },
        {
            name: 'description',
            description: 'Description of assigned role',
            type: 'STRING',
            required: true,
        }
    ],

	callback: async({interaction, args}) => {
        async function addNew(role, server) {
            const schema = {
                server,
                roles: [
                    {
                        name: role.name,
                        description: role.description,
                        id: role.id
                    }
                ],
            }
            const update = new model(schema)
            await update.save()
        }

        async function send(embed) {
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }

        const fancy = new MessageEmbed()

        const roleId = args[0];
        const description = args[1];
        const role = await interaction.guild.roles.fetch(roleId)
        const serverId = interaction.guild.id
        const newRole = {
            name: role.name,
            description: description,
            id: role.id
        }

        let server = await model.findOne({server: serverId}).exec()
        if(!server) {
            addNew(newRole, serverId)
            fancy.setTitle('Creating New Database')
            fancy.setDescription(`New server detected => ${interaction.guild.name}`)
            fancy.setColor('GREEN')
            send(fancy)
        } else if(server) {
            let data = server.roles
            let check = data.filter(item => item.name == role.name)
            if(check.length < 1) {
                fancy.setTitle(`Adding => ${newRole.name}`)
                server.roles.push(newRole)
                await server.save()
                fancy.setColor('GREEN')
                fancy.setDescription(`Role added to database\n${newRole.name} | ${newRole.description} | ${newRole.id}`)
                send(fancy)
            } else {
                fancy.setTitle('ERROR => Double role detected')
                fancy.setColor('RED')
                fancy.setDescription('Found similar role on panel')
                send(fancy)
            }
        }
	},
};