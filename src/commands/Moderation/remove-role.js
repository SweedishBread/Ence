const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moderation-remove-role")
        .setDescription(`Removes a role from a member.`)
        .setDMPermission(false)
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The member from whom the role should be removed.')
                .setRequired(true))
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role that should be removed from the member.')
                .setRequired(true)),

    async execute(interaction, client) {
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('member');
        const member = interaction.options.getMember('member');

        try {
            await member.roles.remove(role, `${interaction.user} removed the role from ${user}`);
            await interaction.reply({ content: `Role removed from <@${user.id}>.`, ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: `Unable to remove role from <@${user.id}>.`});
        }
    },
};