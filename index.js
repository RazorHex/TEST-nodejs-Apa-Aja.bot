const {Client, Collection, MessageEmbed, Interaction} = require('discord.js')
const WOK = require('wokcommands')
const mongoose = require('mongoose')
const path = require('path')
const { Tunnel } = require('request/lib/tunnel')
require("dotenv").config()
//const roleSchema = require('./role_schema')

const client = new Client({intents: 14023})
const owner = process.env.OWNER

client.on('ready', async () => {
    client.user.setPresence({ activities: [{ name: '(/) slash commands' }], status: 'idle' });
    await mongoose.connect(process.env.LOGIN, {
        keepAlive: true
    })
        .then(() => {
            console.log('Connection ok!')
        })
        .catch(err => {
            console.error(err)
        })

    new WOK(client, {
        commandsDir: path.join(__dirname, 'src/commands'),
        testServers: ['852363041696907295', '948855234749431838'],
        botOwners: ['427061541012111362']
    })
        .setDisplayName(client.user.username)
})

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));

//when member join the server
client.on('guildMemberAdd', async (member) => {
    const chs = member.guild.channels.cache
    const fancy = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Welcome to ${member.guild.name}`)
        .setDescription(`Hi ${member.user}, welcome to our server, enjoy your stay while it lasts, because it may never happen again.`)
        .setThumbnail(member.user.avatarURL())
        .setFields(
            {
                name: `User's tag`,
                value: `${member.user.tag}`,
                inline: true
            },
            {
                name: 'Joined At',
                value: member.guild.joinedAt.toDateString(),
                inline: true
            },
            {
                name: 'Select your role',
                value: `${chs.find(ch => ch.name == 'role')}` || `${chs.find(ch => ch.name == 'roles')}` || 'Please ask admin',
                inline: false
            }
        )
        .setFooter({
            text: `Bot's profile picture by Mahesa`
        })

    const welcome = chs.find(ch => ch.name === 'welcome') || chs.find(ch => ch.name === 'general')

    try{
        welcome.send({
            embeds: [fancy]
        })
    } catch {
        console.log('Failed to send welcome message, please provide [ welcome, general ] channel')
    }

})

console.log(`\nStarting bot =============================================================================================\n`)
client.login(process.env.TOKEN)