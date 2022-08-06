const { links, rankHeaderReplacements, statHeader } = require('../../data/rl/vars');
const { bound } = require('./util');

function numeralLogic(Str) {
    if (Str != undefined) {
        let SplStr = Str.split(" ");
        if (SplStr[1]) {
            switch (SplStr[1]) {
                case 'I':
                    SplStr[1] = '1';
                    break;
                case 'II':
                    SplStr[1] = '2';
                    break;
                case 'III':
                    SplStr[1] = '3';
                    break;
                case 'IV':
                    SplStr[1] = '4';
                    break;
                case 'V':
                    SplStr[1] = '5';
                    break;
                default:
                    break;
            }
        }
        return SplStr.join(' ');
    }
    else {
        return undefined;
    }
}

function rewardEmojiLogic(rankObj, rewardLvl) {
    switch (rewardLvl) {
        case 'Unranked':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Bronze':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Silver':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Gold':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Platinum':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Diamond':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Champion':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Grand Champion':
            return emojiLogic(rankObj, rewardLvl + ' 1');
        case 'Supersonic Legend':
            return emojiLogic(rankObj, rewardLvl);
    }
}

function rewardLogic(rankObj, emojiObj, reward) {
    if (reward.Level == 'None')
        reward.Level = 'Unranked';
    let rewardStr = `**SEASON REWARDS:** ${emojiObj[rewardEmojiLogic(rankObj, reward.Level)]}`;
    if (reward.Level != 'Supersonic Legend')
    //if (reward.Level != 'Grand Champion')
        rewardStr += ` **- ${reward.Wins} Wins**`;
    return rewardStr;
}

function emojiLogic(rankObj, rank) {
    if (rank == undefined) return 0;
    for (const i in rankObj) {
        if (rankObj[i].name == rank) {
            return i;
        }
    }
}

function assignRank(displayStorage, rankObj, curRankObj, emojiObj) {

    let tempObj = { playlistId: -1, rank: 'Unranked', div: '', mmr: '0', emoji: emojiObj[0] };

    if (!curRankObj)
        return displayStorage.push(tempObj);


    tempObj.rank = numeralLogic(curRankObj.Rank);
    if (tempObj.rank == undefined || tempObj.rank == '')
        tempObj.rank = 'Unranked';

    tempObj.div = numeralLogic(curRankObj.Div);

    if (tempObj.div == undefined)
        tempObj.div = '';

    tempObj.div = tempObj.div.replace('ision', '');

    tempObj.mmr = (curRankObj.MMR == undefined ? '0' : curRankObj.MMR);
    tempObj.emoji = emojiObj[emojiLogic(rankObj, tempObj.rank)];

    tempObj.rank = tempObj.rank.replace(/Grand Champion/ig, 'Grand Champ');

    tempObj.playlistId = curRankObj.PlaylistId;
    return displayStorage.push(tempObj);
}

function buildDisplay(displayElem) {
    return `${displayElem.rank} ${displayElem.div}\n ${displayElem.mmr}`
}

function buildEmbed(displayStorage, rewards, user, type, api, stat) {

    if (user.platform == 'xbox') user.platform = 'xbl';
    if (user.platform == 'ps4') user.platform = 'psn';

    const statTrackUrl = `${links.tracker.START}${user.platform.toLowerCase()}/${user.searchId}${links.tracker.END}`
    const descriptionText = user.season == user.currentSeason ? `This users Rocket League ranks for the current season.` : `This users Rocket League ranks for season ${user.season}.`
    const footerText = `[Click here for more info](${statTrackUrl})` +
        (api ? `\n* Psyonix has disabled the Rocket League API temporarily.\nPlayer Skills will still be updated when possible.* ` : '')

    let embedToSend = {
        color: [35, 157, 207],
        author: {
            name: user.userInfo.name,
            url: statTrackUrl,
            iconURL: user.icon
        },
        description: descriptionText,
        thumbnail: {
            url: user.userInfo.avatar
        },
        fields: [],
        timestamp: new Date()
    }


    let headerCutoff;

/*    if (displayStorage[3])
        headerCutoff = (displayStorage[3].playlistId == 34 ? 4 : 3);
    else
        headerCutoff = 4;*/

    rankedFields = [
        {
            name: `${'\u2015'.repeat(19)}`,
            value: ' **RANKS** ',
            inline: false
        }
    ];
    extraModesFields = [{
        name: `${'\u2015'.repeat(19)}`,
        value: ' **OTHER RANKS** ',
        inline: false
    }]


    for (const i in displayStorage) {
        const tempDisplay = buildDisplay(displayStorage[i]);

        //Checks bounds for appropiate playlists
        // Fills respective fields with playlist data.


        if (bound(displayStorage[i].playlistId, 10, 13) || displayStorage[i].playlistId === 34)
            rankedFields.push({
                name: `${rankHeaderReplacements[displayStorage[i].playlistId]} ${displayStorage[i].emoji}`,
                value: tempDisplay,
                inline: true
            })
        else if (bound(displayStorage[i].playlistId, 27, 30))
            extraModesFields.push({
                name: `${rankHeaderReplacements[displayStorage[i].playlistId]} ${displayStorage[i].emoji}`,
                value: tempDisplay,
                inline: true
            });
        else if (displayStorage[i].playlistId === 0)
            embedToSend.author.name += ` ${displayStorage[i].mmr}`;

    }


    // Adds fields to embeds
    embedToSend.fields = [...rankedFields, ...extraModesFields];

    if (type == 'STATS') {
        embedToSend.fields.push({
            name: `${'\u2015'.repeat(19)}`,
            value: ' **OTHER RANKS** ',
            inline: false
        })
        for (const i in statHeader) {
            embedToSend.fields.push({
                name: statHeader[i][1],
                value: stat[statHeader[i][0]],
                inline: true
            })
        }
    }

    if (user.season == user.currentSeason) {
        embedToSend.fields.unshift({
            name: `${'\u2015'.repeat(19)}`,
            value: rewards,
            inline: false
        })
    }
    embedToSend.fields.push({
        name: `${'\u2015'.repeat(19)}`,
            value: `** ${ footerText } **`,
            inline: false
        })

    return embedToSend;
}


module.exports.run = (client, args, searchType='None') => {
    const { User, Rewards, Stats, Ranks, ApiIsDown } = args;
    let rankObj, emojiObj;
    let displayStorage = [];
    rankObj = client.rankNew;
    emojiObj = client.rankEmojiNew;


    rewardString = null

    console.log(User)
    if (User.currentSeason == User.season)
        rewardString = rewardLogic(rankObj, emojiObj, Rewards);

    for (const i in Ranks)
        assignRank(displayStorage, rankObj, Ranks[i], emojiObj);

    return buildEmbed(displayStorage, rewardString, User,
        searchType, ApiIsDown, Stats);

}