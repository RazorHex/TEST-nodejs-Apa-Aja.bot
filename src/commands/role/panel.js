const { MessageEmbed, Interaction, MessageActionRow, MessageSelectMenu } = require('discord.js')
const model = require('../model')

module.exports = {
	category: 'role_management',
	description: 'Adding role to user',
	
	slash: true,
	testOnly: true,
	init: (client) => {
		client.on('interactionCreate', async (interaction) => {
			if (!interaction.isSelectMenu()) return;

			const { customId, values, member } = interaction

			if (customId === 'role-select'){
				interaction.update({
					content: `Please check for bot online status`
				})

				await interaction.guild.roles.fetch()
				const fancy = new MessageEmbed()
				const id = parseInt(values[0])
				let role = interaction.guild.roles.cache.find(x => x.id == id)
				let check = member.roles.cache.some(r => r.name == role.name)
				if(check) {
					fancy.setTitle('Removing existing role')
					fancy.setDescription(`User: ${interaction.user.username}\nRole: ${role.name}`)
					member.roles.remove(role).catch(console.error)
				} else {
					fancy.setTitle('Adding new role')
					fancy.setDescription(`User: ${interaction.user.username}\nRole: ${role.name}`)
					member.roles.add(role).catch(console.error)
				}
				interaction.followUp({
					embeds: [fancy],
					ephemeral: true
				})
			}
		})
	},

	/**
	 * 
	 * @param { Interaction } interaction 
	 */
	
	callback: async ({ interaction, client }) => {
		let num = 0
		const guildId = interaction.guildId
		let chs = interaction.guild.channels.cache.find(x => x.name == 'role')
		let options = []
		const fancy = new MessageEmbed()
			.setTitle(interaction.guild.name)
			.setThumbnail(interaction.guild.iconURL())
			.setURL('https://bit.ly/IqT6zt')
			.setDescription('Server Apa-Aja.Com isinya orang random dan kadang suka gak jelas jadi maklumin aja ya')
			.setFooter({
				text: client.user.username,
				iconURL: client.user.avatarURL()
			})

		const field = [
			{
				name: 'Info',
				val: 'This Bot uses slash command, just type "/removerole" to remove a role',
				bool: true
			},
			{
				name: 'Commands',
				val: ' FreadBoat: ;;\n Chip Bot: !\n Melijn: -',
				bool: true
			}
		]

		const server = await model.findOne({server: guildId}).exec()
		for(role of server.roles){
			options.push({
				label: role.name,
				description: role.description,
				value: num.toString()
			})
			num = num + 1
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('role-select')
					.setPlaceholder('Select one role')
					.setMaxValues(1)
					.addOptions(options)
			)

		field.forEach(text => {
			fancy.addField(text.name, text.val, text.bool)
		})

		chs.send({
			embeds: [fancy],
			components: [row]
		})
		
		interaction.reply({
			content: `Panel up and ready to use\n${chs}`,
			ephemeral: true
		})
	},
}