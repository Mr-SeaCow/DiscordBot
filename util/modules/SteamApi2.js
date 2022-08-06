const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);


module.exports.getSteamId = (id, callback) => {
    if (!isNaN(id)) return callback(id);
    steam.resolve(`https://steamcommunity.com/id/${id}`).then((newId) => {
        callback(newId);
    });
}

module.exports.getUserInfo = (id, callback) => {

    steam.getUserSummary(id).then(summary => {
        let returnObj = {}
        returnObj.name = summary.nickname
        returnObj.avatar = summary.avatar.large
        callback(returnObj)
    })

}

module.exports.cleanseId = (id) => {

    if (id && id.includes('steamcommunity.com/'))
        return id.split('/')[4];

    return id;
}