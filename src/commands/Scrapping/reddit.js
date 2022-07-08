const { Interaction, MessageEmbed } = require('discord.js')
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = {
    category: 'web_scrapping',
    description: 'Scrape the reddit url to gain content',
    options: [
        {
            name: 'url',
            description: 'URL of reddit',
            type: 'STRING',
            required: true
        }
    ],
    slash: true,
    testOnly: true,
    guildOnly: true,

    /**
     * @param { Interaction } interaction
     */

    callback: async ( interaction ) => {
        const url = interaction.options.data[0].value
        const fancy = new MessageEmbed()
        const save = {
            subReddit : '',
            link: '',
            image: '',
            video: '',
            context: ''
        }

        //start scrape
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        const sub = $('._20Kb6TX_CdnePoT8iEsls6')
        sub.each((idx, tag) => {
            save.link = $(tag).children('div').children('a').attr().href
            save.subReddit = $(tag).children('div').children('a').children('span').text()
        })
        try{
            save.image = $('._3m20hIKOhTTeMgPnfMbVNN').attr().href
        } catch (err) {}
        try{
            save.video = $("._1EQJpXY7ExS04odI1YBBlj").children('source').attr().src
        } catch (err) {}
        save.context = $('._eYtD2XCVieq6emjKBH3m').text()
        console.log(save.video)

        //embed format
        fancy.setAuthor({
            name: save.subReddit,
            url: `https://www.reddit.com${save.link}`
        })
        fancy.setTitle(save.subReddit)
        fancy.setURL(url)
        fancy.setDescription(save.context)
        if (save.image){
            fancy.setImage(save.image)
        }
        if (save.video){
            fancy.setImage(save.video)
        }

        await interaction.channel.send({
            embeds: [fancy]
        })
    }
}