const {SlashCommandBuilder} = require('@discordjs/builders')
const { MessageActionRow, MessageButton } = require('discord.js');

const databaseInterface = {}//require('../modules/database');

const rankCheck = require('../modules/RocketLeagueRankCheck3').RankClient();
const SteamApi = require('../modules/SteamApi2')
const rlMaster = require('../modules/rlmaster')
const { links } = require('../../data/rl/vars');

function fetchRankInfo(interaction, client, searchId, options, userInfo, presetId, presetCount) {
    rankCheck.getPlayer(searchId, options, async (result) => {
        result['User'] = {
            'icon': links.icons[options.platform],
            'season': result.Season.season,
            'currentSeason': result.Season.currentSeason,
            'searchId': searchId,
            'platform': options.platform,
            'userInfo': userInfo
        }

        let embed = rlMaster.run(client, result)

        const prevPreset = new MessageButton()
                                .setCustomId(`preset_${Number(presetId)-1}`)
                                .setLabel(`Preset ${Number(presetId)-1}`)
                                .setStyle('SECONDARY');
        const nextPreset = new MessageButton()
                                .setCustomId(`preset_${Number(presetId)+1}`)
                                .setLabel(`Preset ${Number(presetId)+1}`)
                                .setStyle('SECONDARY');    
        
        let row;
        if (presetId >= presetCount)
            row = new MessageActionRow()
                        .addComponents(
                            prevPreset
                        )
        else if (presetId <= 1)
            row = new MessageActionRow()
                        .addComponents(
                            nextPreset
                        )
        else
            row = new MessageActionRow()
                        .addComponents(
                            prevPreset,
                            nextPreset
                        )

        await interaction.editReply({embeds: [embed], components: [row]})
    })
}


function addPreset(interaction, platform, vanity, search = vanity) {
    databaseInterface.addPresetByDiscordId(interaction.user.id, platform.toUpperCase(), search, vanity, (res) => {
        if (res == 1)
            interaction.editReply('Information added successfully!');
        else
            interaction.editReply('Oops, something went wrong!');
    });
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('preset')
        .setDescription('Rocket League Rank Check Presets')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lists all of your presets.')       
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName('add')
                .setDescription('Adds a new preset')
                .addStringOption(option=>
                    option
                        .setName('player_id')
                        .setDescription('The ID of the player.')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('platform')
                        .setDescription('The platform of the player.')
                        .setRequired(true)
                        .addChoices(
                            {
                                name: 'Steam', 
                                value: 'steam'
                            },
                            {
                                name: 'Epic', 
                                value: 'epic'
                            },
                            {
                                name: 'PS4', 
                                value: 'psn'
                            },
                            {
                                name: 'XBOX', 
                                value: 'xbl'
                            },
                            {
                                name: 'Switch',
                                value: 'switch'
                            }))
                )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Removes a preset number')
                .addIntegerOption(option =>
                    option
                        .setName('number')
                        .setDescription('The number of the preset to delete.')
                        .setRequired(true)
                )
            )
        .addSubcommand(subcommand => 
            subcommand
                .setName('display')
                .setDescription('Shows the rank of a preset')
                .addIntegerOption(option =>
                    option
                        .setName('number')
                        .setDescription('The number of the preset to show.')
                )
            ),
    async execute(client, interaction) {
        let subcommand = await interaction.options.getSubcommand()
        console.log(subcommand)
        if (subcommand === 'list') {
            await interaction.deferReply({ephemeral: true})
            databaseInterface.getByDiscordId(interaction.user.id, async (res) => {
                if (res) {
                    let tempAra = [`"Presets for ${interaction.user.username}"`,
                        '-------------------------------------------']
                    for (let i = 0; i < res.length; i++) {
                        tempAra.push(`"${i+1} ${res[i]['platform']}": "${res[i]['vanity']}"`)
                    }
                    await interaction.editReply(` \`\`\`json\n${tempAra.join('\n')}\`\`\` `);
                } else
                    await interaction.editReply({ content: 'Oops, something went wrong!' });
            })
            return;
        } else if (subcommand === 'add') {
            await interaction.deferReply({ephemeral: true})
            let platform = interaction.options.getString('platform')
            let playerId = interaction.options.getString('player_id')

            if (platform === 'steam') {
                playerId = SteamApi.cleanseId(playerId)
                SteamApi.getSteamId(playerId, (searchId) => {
                    addPreset(interaction, platform, playerId, searchId);
                })
            } else {
                addPreset(interaction, platform, playerId);
            }
            return;
        } else if (subcommand === 'remove') {
            await interaction.deferReply({ephemeral: true})
            let presetId = interaction.options.getInteger('number')
            if (presetId <= 0) {
                return await interaction.editReply('Number must be greater than zero.');
            }
            databaseInterface.deletePresetByDiscordId(interaction.user.id, presetId-1, async (res) => {
                if (res == 1)
                    await interaction.editReply('Information deleted successfully!');
                else if (res == 'error')
                    await interaction.editReply('Seems like you hav enothing to delete.');
                else
                    await interaction.editReply('Oops, something went wrong!');
            })
            return;
        } else if (subcommand === 'display') {
            await interaction.deferReply({ephemeral: false})
            let presetId = interaction.options.getInteger('number') === null ? 2 : interaction.options.getInteger('number');
            presetId--;
            if (presetId <= 0) {
                return await interaction.editReply('Number must be greater than zero.');
            }

            databaseInterface.getByDiscordId(interaction.user.id, async (res)=> {
                if (!res) {
                    return await interaction.editReply('Oops, something went wrong!');
                }
                let platform = res[presetId]['platform'];
                let playerId = res[presetId]['vanity'];
                let season = null;
                if (platform == 'STEAM') {
                    SteamApi.getSteamId(playerId, (searchId) => {
                        SteamApi.getUserInfo(searchId, (userInfo) => {
                            fetchRankInfo(interaction, client, playerId, {platform, season}, userInfo, presetId, res.length)
                        })
                    })
                } else {
                    fetchRankInfo(interaction, client, playerId, {platform, season}, {name: playerId, avatar: links.avatar}, presetId, res.length)
                }

            })

        }
            
    },
    async changePreset(client, interaction) {
        await interaction.deferUpdate()

        let parsedInfo = interaction.customId.split('_');
        let presetId = parsedInfo[1];
        presetId--;
        databaseInterface.getByDiscordId(interaction.user.id, async (res)=> {
            let platform = res[presetId]['platform'];
            let playerId = res[presetId]['vanity'];
            let season = null;
            if (platform == 'STEAM') {
                SteamApi.getSteamId(playerId, (searchId) => {
                    SteamApi.getUserInfo(searchId, (userInfo) => {
                        fetchRankInfo(interaction, client, playerId, {platform, season}, userInfo, presetId+1, res.length)
                    })
                })
            } else {
                fetchRankInfo(interaction, client, playerId, {platform, season}, {name: playerId, avatar: links.avatar}, presetId+1, res.length)
            }

        })
    }
}