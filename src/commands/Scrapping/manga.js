const { CommandInteraction, MessageEmbed } = require('discord.js')
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
	category: 'web_scrapping',
	description: 'Scrape the internet for manga',
	options:[
		{
			name: 'url',
			description: 'The manga url to scrape',
			type: 'STRING',
			required: true
		}
	],
	
	slash: true,
	testOnly: true,
	guildOnly: true,

	/**
	 * @param { CommandInteraction } interaction
	 */
	
	callback: async ( interaction ) => {
		const fancy = new MessageEmbed()
		const save = {
			cove: '',
			name: '',
			description: '',
			author: [],
			chapter: '',
			status: '',
			update: '',
			genre: []
		}

		const url = interaction.options.data[0].value
		const { data } = await axios.default.get(url)
		const $ = cheerio.load(data)
		
		//start scrape
		save.cover = $('.cover').children('img').attr().src
		save.name = $('.info').children('h1').text()
		const auth = $('.author')
		auth.each((num, a) => {
			save.author.push($(a).text())
		})
		const listData = $('.meta.d-table').children('li')
		listData.each((num, li) => {
			if($(li).children('div').hasClass('d-cell-small value status ongoing')){
				save.status = 'Ongoing'
			} else if ($(li).children('div').hasClass('d-cell-small value status completed')){
				save.status = 'Completed'
			}
		})
		save.description = $('.summary').children('p').text()

		//embeding
		fancy.setImage(save.cover)
		fancy.setTitle(save.name)
		fancy.setURL(url)
		fancy.setDescription(save.description)
		fancy.addField('Author', save.author.join('\n'), true)
		fancy.addField('Status', save.status, true)

		await interaction.channel.send({
			embeds: [fancy]
		})
	}
}