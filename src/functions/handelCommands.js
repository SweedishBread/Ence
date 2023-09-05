const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const colors = require('colors');

const clientId = '1099516592120938496';
const guildId = '1088625669342240788';

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];

        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);

        (async () => {
            try {
                console.log(colors.yellow.bold(('Started refreshing application (/) commands.')));

                for (folder of commandFolders) {
                    const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
                    for (const file of commandFiles) {
                        try {
                            console.log(colors.yellow.bold((`Loading ${file}...`)));
                            const command = require(`../commands/${folder}/${file}`);
                            client.commands.set(command.data.name, command);
                            client.commandArray.push(command.data.toJSON());
                        } catch (error) {
                            console.error(colors.red.bold(`Error Loading ${file}: ${error.message}`));
                        }
                    }
                }

                if (client.commandArray.length === 0) {
                    console.log('No commands found.');
                    return;
                }

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log(colors.green.bold(('Successfully reloaded application (/) commands.')));
            } catch (error) {
                console.error(error);
            }
        })();
    };
};