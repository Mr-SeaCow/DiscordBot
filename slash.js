const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {token, guild_id, application_id} = require('./keys/keys');
const fs = require('fs')
const path = require('path')


const commands = [];
const commandsPath = path.join(__dirname, '/util/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(application_id, guild_id),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();