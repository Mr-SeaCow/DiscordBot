
module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) {
        if(interaction.isButton()) {
            if (interaction.customId.startsWith('rl_')) {
                let command = client.commands.get('rl');
                await command.changeSeason(client, interaction);
                return;
            }

            if (interaction.customId.startsWith('preset_')) {
                let command = client.commands.get('preset');
                await command.changePreset(client, interaction);
                return;
            }
        }
        
        return;
    }
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

}