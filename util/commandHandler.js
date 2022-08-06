const { Collection } = require('discord.js');
const fs = require('fs');
module.exports = (client) => {

    client.commands = new Collection()

    fs.readdir('./util/commands/', (err, files) => {
        if (err) return console.log(err);
        let commands = files.filter(f => f.split('.').pop() === 'js');
        if (commands.length <= 0) return;

        commands.forEach((f, i) => {
            let cmds = require(`./commands/${f}`);
            client.commands.set(cmds.data.name, cmds);
        });
    })
}