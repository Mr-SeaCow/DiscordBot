const keys = require('./keys/keys');

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });



require('./util/commandHandler')(client)
require('./util/eventHandler')(client)

client.login(keys.token)