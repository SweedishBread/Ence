const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("community-poll")
        .setDescription("Create a poll and send it to a certain channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Describe the poll.")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Where do you want to send the poll to?")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel("channel");
        const description = options.getString("description");

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(description)
            .setTimestamp();

        try {
            const m = await channel.send({ embeds: [embed] });
            await m.react("✅");
            await m.react("❌");

            // Create reaction collectors for ✅ and ❌ reactions
            const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && !user.bot;
            const collector = m.createReactionCollector({ filter, time: 60000 }); // Adjust the time as needed

            // Initialize vote counters
            let yesVotes = 0;
            let noVotes = 0;

            collector.on("collect", (reaction) => {
                if (reaction.emoji.name === "✅") {
                    yesVotes++;
                } else if (reaction.emoji.name === "❌") {
                    noVotes++;
                }
                // Update the embed with the new vote counts
                embed.fields = [
                    { name: "✅ Votes", value: yesVotes.toString(), inline: true },
                    { name: "❌ Votes", value: noVotes.toString(), inline: true },
                ];
                m.edit({ embeds: [embed] });
            });

            collector.on("end", () => {
                // Update the embed one last time when the collection period ends
                embed.fields = [
                    { name: "✅ Votes", value: yesVotes.toString(), inline: true },
                    { name: "❌ Votes", value: noVotes.toString(), inline: true },
                ];
                m.edit({ embeds: [embed] });
            });

            await interaction.reply({ content: "Poll was successfully sent to channel.", ephemeral: true });
        } catch (err) {
            console.log(err);
        }
    }
}