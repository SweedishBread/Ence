const { Client, GatewayIntentBits, PermissionsBitField, Permissions, PartialTypes, MessageManager, Embed, Collection, ChannelType } = require(`discord.js`);
const fs = require('fs');
const colors = require('colors');
require('dotenv').config();
const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const mongoose = require('mongoose');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }

    console.log(colors.yellow.bold((`Logging into bot...`)))
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

client.on('messageCreate', async (message) => {
  // Check if the message was sent by a bot or is not in a guild
  if (message.author.bot || !message.guild) return;

  // Get the prefix for this guild (you can store this in a database)
  const guildPrefix = getGuildPrefix(message.guild.id);

  // Check if the message starts with the guild's prefix or the default prefix
  if (message.content.startsWith(guildPrefix) || message.content.startsWith(defaultPrefix)) {
    // Remove the prefix from the message content and split it into an array of arguments
    const args = message.content.slice(guildPrefix.length || defaultPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase(); // Get the command (the first argument)

    // Implement your command handling logic here
    if (command === 'ping') {
      // Example command: !ping
      message.reply('Pong!');
    } else if (command === 'help') {
      // Example command: !help
      message.reply('This is a help message.');
    }
  }
});

// Replace this function with your own logic to fetch guild prefixes from a database
function getGuildPrefix(guildId) {
  // Example: Fetch the prefix from a database or configuration file
  return '!';
}
-------------------------------------------------------------------------------------------

/// TICKET SYSTEM //
 
const ticketSchema = require("../src/schemas/ticketSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  const { customId, guild, channel } = interaction;
  if (interaction.isButton()) {
    if (customId === "ticket") {
      let data = await ticketSchema.findOne({
        GuildID: interaction.guild.id,
      });
 
      if (!data) return await interaction.reply({ content: "Ticket system is not setup in this server", ephemeral: true })
      const role = guild.roles.cache.get(data.Role)
      const cate = data.Category;
 
 
      await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        parent: cate,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["ViewChannel"]
          },
          {
            id: role.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
          {
            id: interaction.member.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
          },
        ],
      }).then(async (channel) => {
        const openembed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Ticket Opened")
          .setDescription(`Welcome to your ticket ${interaction.user.username}\n React with 🔒 to close the ticket`)
          .setThumbnail(interaction.guild.iconURL())
          .setTimestamp()
          .setFooter({ text: `${interaction.guild.name}'s Tickets` })
 
          const closeButton = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
          )
          await channel.send({ content: `<@&${role.id}>`, embeds: [openembed], components: [closeButton] })
 
          const openedTicket = new EmbedBuilder()
          .setDescription(`Ticket created in <#${channel.id}>`)
 
          await interaction.reply({ embeds: [openedTicket], ephemeral: true })
      })
    }
 
    if (customId === "closeticket") {
      const closingEmbed = new EmbedBuilder()
      .setDescription('🔒 are you sure you want to close this ticket?')
      .setColor('Red')
 
      const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('yesclose')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('✅'),
 
        new ButtonBuilder()
        .setCustomId('nodont')
        .setLabel('No')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
      )
 
      await interaction.reply({ embeds: [closingEmbed], components: [buttons] })
    }
 
    if (customId === "yesclose") {
      let data = await ticketSchema.findOne({ GuildID: interaction.guild.id });
      const transcript = await createTranscript(channel, {
        limit: -1,
        returnBuffer: false,
        filename: `ticket-${interaction.user.username}.html`,
      });
 
      const transcriptEmbed = new EmbedBuilder()
      .setAuthor({ name: `${interaction.guild.name}'s Transcripts`, iconURL: guild.iconURL() })
      .addFields(
        {name: `Closed by`, value: `${interaction.user.tag}`}
      )
      .setColor('Red')
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
      .setFooter({ text: `${interaction.guild.name}'s Tickets` })
 
      const processEmbed = new EmbedBuilder()
      .setDescription(` Closing ticket in 10 seconds...`)
      .setColor('Red')
 
      await interaction.reply({ embeds: [processEmbed] })
 
      const channelID = data.Logs;
      const mChannel = guild.channels.cache.get(channelID);
        embeds: [transcriptEmbed]
        files: [transcript]
      };
 
      setTimeout(() => {
        interaction.channel.delete()
      }, 10000);

 
     if (customId === "nodont") {
        const noEmbed = new EmbedBuilder()
        .setDescription('🔒 Ticket close cancelled')
        .setColor('Red')
  
        await interaction.reply({ embeds: [noEmbed], ephemeral: true })
     }
  }
})
