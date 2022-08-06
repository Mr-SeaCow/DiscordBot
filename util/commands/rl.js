const {SlashCommandBuilder} = require('@discordjs/builders')
const { MessageActionRow, MessageButton } = require('discord.js');
const rankCheck = require('../modules/RocketLeagueRankCheck3').RankClient();
const SteamApi = require('../modules/SteamApi2')
const rlMaster = require('../modules/rlmaster')
const { links } = require('../../data/rl/vars');

function fetchRankInfo(interaction, client, searchId, options, userInfo) {
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

        const prevSeason = new MessageButton()
                                .setCustomId(`rl_${Number(result.Season.season)-1}_${searchId}_${options.platform}`)
                                .setLabel(`Season ${Number(result.Season.season)-1}`)
                                .setStyle('SECONDARY');
        const nextSeason = new MessageButton()
                                .setCustomId(`rl_${Number(result.Season.season)+1}_${searchId}_${options.platform}`)
                                .setLabel(`Season ${Number(result.Season.season)+1}`)
                                .setStyle('SECONDARY');    
        
        let row;
        if (result.Season.currentSeason <= result.Season.season)
            row = new MessageActionRow()
                        .addComponents(
                            prevSeason
                        )
        else if (result.Season.season <= 1)
            row = new MessageActionRow()
                        .addComponents(
                            nextSeason
                        )
        else
            row = new MessageActionRow()
                        .addComponents(
                            prevSeason,
                            nextSeason
                        )

        await interaction.editReply({embeds: [embed], components: [row]})
    })
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('rl')
            .setDescription('Rocket League Rank Check')
            .addSubcommand(subcommand => 
                subcommand
                    .setName('lookup')
                    .setDescription('Lookup a player by id.')
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
                    .addIntegerOption(option => 
                        option
                            .setName('season')
                            .setDescription('The season of the rank to fetch.'))

            ),
            // .addIntegerOption(option => 
            //     option
            //         .setName('season')
            //         .setDescription('The season of the rank to fetch.')),
    async execute(client, interaction) {
        await interaction.deferReply({ephemeral: false})

        let platform = interaction.options.getString('platform')
        let playerId = interaction.options.getString('player_id')
        let season = interaction.options.getInteger('season')

        if (platform == 'steam') {
            SteamApi.getSteamId(playerId, (searchId) => {
                SteamApi.getUserInfo(searchId, (userInfo) => {
                    fetchRankInfo(interaction, client, playerId, {platform, season}, userInfo)
                })
            })
        } else {
            fetchRankInfo(interaction, client, playerId, {platform, season}, {name: playerId, avatar: links.avatar})     
        }

    },
    async changeSeason(client, interaction) {
        await interaction.deferUpdate()

        let parsedInfo = interaction.customId.split('_')

        let platform = parsedInfo[3]
        let playerId = parsedInfo[2]
        let season = parsedInfo[1]

        if (platform == 'steam') {
            SteamApi.getSteamId(playerId, (searchId) => {
                SteamApi.getUserInfo(searchId, (userInfo) => {
                    fetchRankInfo(interaction, client, playerId, {platform, season}, userInfo)
                })
            })
        } else {
            fetchRankInfo(interaction, client, playerId, {platform, season}, {name: playerId, avatar: links.avatar})     
        }
    }
}