const { MessageEmbed } = require('discord.js')

module.exports = {
	category: 'role_menagement',
	description: 'Remove role from user',

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
        const role = await interaction.guild.roles.fetch(args[0])
        const fancy = new MessageEmbed()
            .setTitle(`Removing role from ${interaction.user.username}`)

        const { member } = interaction
        let check = member.roles.cache.some(r => r.name == role.name)
        if (check) {
            fancy.setDescription(`Removing: ${role.name}\nStatus: Removed`)
            member.roles.remove(role)
        } else {
            fancy.setDescription(`Status: Error\nError: User haven't joined the role`)
        }

        interaction.reply({
            embeds: [fancy],
            ephemeral: true
        })
	}
}