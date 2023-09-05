const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const warningSchema = require('../../../src/schemas/WarnSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moderation-removewarn')
    .setDescription('Remove a warning from a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user').setRequired(true))
    .addIntegerOption(option => option.setName('warn_id').setDescription('ID of the warning to remove').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const warnId = interaction.options.getInteger('warn_id');

    try {
      const removedWarning = await warningSchema.findOneAndDelete({ warningId: warnId, userId: user.id });

      if (!removedWarning) {
        interaction.reply('Warning not found.');
        return;
      }

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Warning Removed')
        .setDescription(`Warning ${warnId} removed for ${user.tag}\nReason: ${removedWarning.reason}`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('An error occurred while removing the warning.');
    }
  },
};