const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('moderation-ban')
    .setDescription(`This bans a user`)
    .addUserOption(option => option.setName('user').setDescription(`The member you want to ban`).setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription(`The reason for banning the member`).setRequired(true)),
    async execute(interaction, client) {
 
        const users = interaction.options.getUser('user');
        const ID = users.id;
        const banUser = client.users.cache.get(ID)
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "You must have the ban members permission to use this command", ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: "YOu cannot ban yourse3lf!", ephemeral: true});
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given";
 
        const dmEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  You have been banned from **${interaction.guild.name}** | ${reason}`)
 
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${banUser.tag} has been banned | ${reason}`)
 
        await interaction.guild.bans.create(banUser.id, {reason}).catch(err => {
            return interaction.reply({ content: "I cannot ban this member!", ephemeral: true})
        })
 
        await banUser.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })
 
        await interaction.reply({ embeds: [embed] });
    } 
}