const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const warningSchema = require('../../../src/schemas/WarnSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moderation-add-warn')
    .setDescription('Add a warning to a user')
    .addUserOption(option => option.setName('user').setDescription('Select the user').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the warning').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    try {
      // Find the highest warningId and increment it
      const highestWarning = await warningSchema.findOne().sort({ warningId: -1 });
      const newWarningId = highestWarning ? highestWarning.warningId + 1 : 1;

      // Create a new warning
      const newWarning = await warningSchema.create({
        warningId: newWarningId,
        userId: user.id,
        reason: reason,
      });

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Warning Added')
        .setDescription(`Warning added for ${user.tag}\nReason: ${reason}\nWarning ID: ${newWarning.warningId}`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('An error occurred while adding the warning.');
    }
  },
};