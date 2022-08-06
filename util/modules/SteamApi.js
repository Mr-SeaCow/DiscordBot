/* SteamApi.js
 * 
 * Summary: This module allows someone to get the 64 bit steam id from a vanity
 *          id. This module imports the steam-api.
 * Author: Matthew Van Vleet
 * Date: 5/19/2020
 * Summary of Modifications: 
 */
const http = require('http');
const SteamApi = require('steam-api');
const user = new SteamApi.User(process.env.STEAM_API_KEY);
const apiLink = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=`
const apiLink2 = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?key=${process.env.STEAM_API_KEY}&appid=730&steamid=`
const player = new SteamApi.Player(process.env.STEAM_API_KEY);

module.exports.getSteamId = (id, callback) => {
    if (!isNaN(id)) return callback(id);
    user.ResolveVanityUrl(id).done((newId) => {
        callback(newId);
    });
}

module.exports.getUserInfo = (id, callback) => {
    http.get(apiLink + id, (results) => {
        console.log(apiLink + id)
        results.setEncoding('utf8');
        let body = '';
        results.on('data', (data) => {
            body += data;
        })
        results.on('end', () => {
            body = JSON.parse(body);
            let returnObj = {}
            try {
                returnObj.name = body.response.players[0].personaname;
                returnObj.avatar = body.response.players[0].avatarfull;
                callback(returnObj);
            } catch (e) {
                console.log(e)
                callback('err');
            }
        })
    })
}

module.exports.player = player;
module.exports.user = user;

module.exports.run = (id, callback) => {

    this.getSteamId(id, (steamID) => {
        if (steamID == undefined)
            callback('private');

        http.get(apiLink2 + steamID, res2 => {
            res2.setEncoding("utf8");
            let body = "";
            res2.on("data", data => {
                body += data;
            });
            res2.on("end", () => {
                if (!body.startsWith("<html>")) {
                    body = JSON.parse(body);
                    callback(body)
                }
                else
                    callback('private');
               

            });
        });

    })
}

module.exports.cleanseId = (id) => {

    if (id && id.includes('steamcommunity.com/'))
        return id.split('/')[4];

    return id;
}