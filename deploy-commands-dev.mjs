import fs from 'fs';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import gameData from './modules/game-data.mjs';

const { clientId, guildId, token } = JSON.parse(fs.readFileSync('config-dev.json'));

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.mjs'));

try {
    await gameData.load();
    for (const file of commandFiles) {
        const command = await import(`./commands/${file}`);
        commands.push(command.default.data.toJSON());
    }
    
    const rest = new REST({ version: '9' }).setToken(token);
    
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);
} catch (error) {
    console.log('Error registering commands', error);
}
