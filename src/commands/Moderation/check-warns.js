const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const warningSchema = require('../../../src/schemas/WarnSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moderation-check-warns')
    .setDescription('Check warnings of a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const warnings = await warningSchema.find({ userId: user.id });

      if (warnings.length === 0) {
        const embed = new EmbedBuilder()
          .setColor('Red')
          .setTitle(`Warnings for ${user.tag}`)
          .setDescription('No warnings found for this user.');

        interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('Green')
          .setTitle(`Warnings for ${user.tag}`)
          .setDescription(warnings.map((warning, index) => `**Warning ${index + 1}:** ${warning.reason}`).join('\n'));

        interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      interaction.reply('An error occurred while fetching warnings.');
    }
  },
};