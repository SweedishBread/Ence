const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
    .setName('userid')
    .setDescription('check yours or another users discord id')
    .addUserOption(option => option.setName('user').setDescription('the user whos id you want to get')),
async execute(interaction) {
    
    const user = interaction.options.getUser('user');
    
    const nouser = new EmbedBuilder()
    .setColor('Blue')
    .setDescription(`${interaction.member} your id is (${interaction.member.id})`)

    if(!user) return interaction.reply({embeds: [nouser] })

    const userid = new EmbedBuilder()
    .setColor('Blue')
    .setDescription(`${user}'s id is (${user.id})`)

    return interaction.reply({ embeds: [userid] })
    }
};