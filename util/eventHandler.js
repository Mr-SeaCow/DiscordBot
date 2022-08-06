const fetchEvent = (eventName) => require(`./events/${eventName}.js`);

module.exports = (client, settings) => {
    client.once('ready', () => { fetchEvent('ready')(client) });
    client.on('interactionCreate', async interaction => { await fetchEvent('interactionCreate')(client, interaction)});
    // client.on('message', (message) => { fetchEvent('message')(client, settings, message) })
    // client.on('guildMemberAdd', (member) => { fetchEvent('guildMemberAdd')(client, member, settings) });

}