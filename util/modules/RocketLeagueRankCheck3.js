//https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/76561198160445894/segments/playlist?season=3
//https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/76561198346756402?
//https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/76561198346756402/sessions?
const { fetchPageInfo } = require('./puppeteer-client')
const { statTitles } = require('../../data/rl/vars');
const { rankNew } = require('../../data/rl/ranks');
const { r, decapitalize } = require('./util');

function RankClient() {
    this.getPlayer = (userId, callOptions, callback, callbackError) => {

        const options = {
            host: 'api.tracker.gg',
            path: `/api/v2/rocket-league/standard/profile/${r(callOptions.platform.toLowerCase(), ',')}/${r(userId, ',')}`,
        }

        let url = buildCallUrl(options)

        fetchPageInfo(url, (res) => {

                if (res.search('We could not find player') != -1) return callbackError(1);
                if (res.search('Server Error') != -1) return callbackError(5);
                
                const data = JSON.parse(res).data;

                const currentSeason = getCurrentSeason(data);
                // HANDLE SEASON STUFF HERE
                const info = {                    
                    Season: {
                        currentSeason,
                        season: (callOptions.season === null ? currentSeason : callOptions.season)
                    },
                    Rewards: parseSeasonRewardData(data),
                    Stats: parseStatData(data),
                    apiIsDown: false
                }

                if (callOptions.season != null && callOptions.season <= currentSeason) {
                        url += `/segments/playlist?season=${callOptions.season}`;
                        fetchPageInfo(url, (res) => {

                            if (res.search('We could not find player') != -1) return callbackError(1);
                            if (res.search('Server Error') != -1) return callbackError(5);
                            
                            const seasonData = JSON.parse(res).data;
                            info['Ranks'] = parseRankData(seasonData)
                            fixPlaylistMismatch(info, callback)
                        })
                } else {
                    info['Ranks'] = parseRankData(data);
                    fixPlaylistMismatch(info, callback)
                }
        })

    }

    return this;
}

function fixPlaylistMismatch(info, callback) {
    let mk1 = -1;
    let mk2 = -1;
    let mk3 = -1;

    for (const i in info.Ranks) {
        if (!info.Ranks[i].hasOwnProperty('PlaylistId'))
            return callback(info);       
        else if (info.Ranks[i].PlaylistId == 12)
            mk1 = i;
        else if (info.Ranks[i].PlaylistId == 13)
            mk2 = i;
        else if (info.Ranks[i].PlaylistId == 34)
            mk3 = i;
    }

    if (mk1 != -1 && mk2 != -1)
        [info.Ranks[mk1], info.Ranks[mk2]] = [info.Ranks[mk2], info.Ranks[mk1]];

    if (mk3 != -1)
        [info.Ranks[3], info.Ranks[mk3]] = [info.Ranks[mk3], info.Ranks[3]];

    if (info.Ranks[info.Ranks.length - 1].PlaylistId == 12)
        info.Ranks.pop();

    callback(info);
}

function parseRankData(data) {
    const returnAra = []
    const segments = data.hasOwnProperty('segments') ? data.segments : data;

    for (const playlist in segments)
        if (segments[playlist].type === 'playlist')
            returnAra.push(parsePlaylistData(segments[playlist]));

    return returnAra;

}

function parsePlaylistData(data) {
    const id = data.attributes.playlistId;
    const title = data.metadata.name;
    const rank = rankNew[data.stats.tier.value].name;
    const div = (rank == "Supersonic Legend") ? "" : `Div ${data.stats.division.value + 1}`;
    const mmr = `(${data.stats.rating.value})`;

    return {
        "PlaylistId": id,
        "Title": title,
        "Rank": rank,
        "Div": div,
        "MMR": mmr
    };
}

function parseSeasonRewardData(data) {
    const overview = getOverviewSegment(data);

    const level = overview.stats.seasonRewardLevel.metadata.rankName;
    const wins = overview.stats.seasonRewardWins.value;

    return {
        'Level': level,
        'Wins': wins
    }
}

function parseStatData(data) {

    const overview = getOverviewSegment(data);
    const storageObj = {}

    for (let i = 0; i < statTitles.length; i++) {
        let statVal = overview.stats[decapitalize(statTitles[i])].value;
        if (i == 0)
            statVal = Math.round(statVal * 10) / 10;
        storageObj[`${statTitles[i]}`] = statVal
    }

    storageObj['MvpWinRatio'] = Math.round((overview.stats['mVPs'].value / overview.stats['wins'].value) * 1000) / 10;

    return storageObj;
}

function getOverviewSegment(data) {
    return data.segments.find((x) => x.type === 'overview');
}

function getCurrentSeason(data) {
    return data.metadata.currentSeason;
}

// function fetchSeasonRanks(callOptions, season) {
//     callOptions.path += `/segments/playlist?season=${season}`;
//     const callUrl = buildCallUrl(callOptions);

//     return JSON.parse(syncRequest('GET', callUrl).getBody());

// }

function buildCallUrl(callOptions) {
    return `https://` + callOptions.host + callOptions.path;
}

module.exports.RankClient = RankClient;