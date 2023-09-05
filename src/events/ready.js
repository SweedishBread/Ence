const mongoose = require('mongoose');
const chalk = require('chalk');
const { Client } = require('discord.js');
const mongo = process.env.MONGODB_URL;
const { ActivityType } = require('discord.js');

// Database Connection Progress Bar
function progressBar(progress) {
    const barLength = 20;
    const completed = Math.round(barLength * (progress / 100));
    const remaining = barLength - completed;
    return `${progress}%`;
}

// Ready Event
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        const status = await client.user.setActivity({
            type: ActivityType.Custom,
            name: 'customstatus',
            state: 'Custom Status Working'
        })

        console.log(chalk.blue.bold(`${client.user.username} is now online.`));
        console.log(chalk.cyan.bold(`Bot is currently ${client.user.presence.status}`));

        console.log(chalk.yellow.bold('Enabling Status'));
        console.log(chalk.green.bold('Status Enabled ✅'));

        // Database Connection
        console.log(chalk.bold("Connecting to the database..."));

        try {
            const maxProgress = 100;
            const progressUpdateInterval = 10; // Increase to set more frequent updates

            for (let progress = 10; progress <= maxProgress; progress += progressUpdateInterval) {
                console.log(chalk.yellow.bold(`Database Connecting: ${progressBar(progress)}`));
                await new Promise(resolve => setTimeout(resolve, 500)); // Increased to 0.5 second delay
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Increased to 1 second delay

            mongoose.connection.on('connecting', () => {
                console.log(chalk.gray.bold('Database Connection: Attempting to connect...'));
            });

            mongoose.connection.on('connected', () => {
                console.log(chalk.green.bold('Database Connection: ✅ Connected'));
            });

            mongoose.connection.on('error', (error) => {
                console.error(chalk.red.bold('Error connecting to the database:', error.message));
            });

            mongoose.connection.on('disconnected', () => {
                console.log(chalk.red.bold('Database Connection: ❌ Disconnected'));
            });

            await mongoose.connect(mongo, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            if (mongoose.connection.readyState !== 1) {
                console.log(chalk.red.bold('Database Connection: ❌ Weak'));
            }

        } catch (error) {
            console.error(chalk.red.bold('Error connecting to the database:', error.message));
            console.log(chalk.red.bold('Database Connection: ❌ Failed'));
        }
    }
};