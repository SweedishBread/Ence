const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moderation-add-role")
        .setDescription(`Adds a role to a member.`)
        .setDMPermission(false)
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The member who should be given the role.')
                .setRequired(true))
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role that should be given to the member.')
                .setRequired(true)),

    async execute(interaction, client) {
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('member');
        const member = interaction.options.getMember('member');
        
        try {
            await member.roles.add(role, `${interaction.user} added the role to ${user}`);
            await interaction.reply({ content: `Role added to <@${user.id}>.`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: `Unable to add role to <@${user.id}>.`});
        }
    },
};