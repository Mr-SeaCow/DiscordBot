/* database.js
 *
 * Summary: This module is an interface to interact with the MySql database.
 *          This module imports the @mysql/xdevapi in order to interact with
 *          the database.
 * Author: Matthew Van Vleet
 * Date: 5/19/2020
 * Summary of Modifications
 * 
 * COMMON PARAMETERS
 * discord_id - the snowflake of the user
 * preset - is the number to get of the results belonging to the user
 * platform - is the platform the user is passing (STEAM, PS4, XBOX, EPIC)
 * vanity - is the neat name to return with the list
 * search - is the 64-bit number for STEAM
 * callback - is a function that should be passed(results.toArray()) or errors
 * 
 * INVARIANCE OF THE DATABASE INTERFACE
 * getAll(callback) - returns an array of all the rows and columns in the table
 * 
 * getByDiscordId(discord_id, callback) - returns an array of rows that have 
 *          the parameter value discord_id
 *          
 * deletePresetByDiscordId(discord_id, preset, callback) - deletes the preset
 *          number that belongs to the discord_id if it exists. If none were
 *          effected it returns 0. If it was out of range, it returns error.
 *          If successful it returns 1.
 *  
 *  updatePresetByDiscordId(discord_id, preset, platform, search, vanity,
 *          callback) - deletes the preset number that belongs to the 
 *          discord_id if it exists. If none were effected it returns 0. 
 *          If it was out of range, it returns error.If successful it returns 1.
 *  addPresetByDiscordId(discord_id, platform, search, vanity, callback) -
 *          deletes the preset number that belongs to the discord_id if it 
 *          exists. If none were effected it returns 0.If it was out of range, 
 *          it returns error.If successful it returns 1.
 */
const {createClient} = require('redis');
const redisClient = createClient();
redisClient.connect()

function strToObj(str) {
    return JSON.parse(str);
}

function objToStr(obj) {
    return JSON.stringify(obj);
}

function accountIsEqual(acc, platform, search, vanity) {
    return acc.vanity === vanity && acc.search === search && acc.platform === platform;
}

module.exports.getAll = async (callback) => {

    let res = [];
    for await (const key of redisClient.scanIterator()) {
        // use the key!
        let val = await redisClient.get(key);
        val = strToObj(val);
        val['discord_id'] = key;
        res.push(val);
      }


      return callback(res);

}

module.exports.getByDiscordId = async (discord_id, callback) => {
    if (await redisClient.exists(discord_id) === 0) {
        return callback(0)
    }
    let res = await redisClient.get(discord_id);
    res = strToObj(res);
    return callback(res['accounts'])
}

module.exports.deletePresetByDiscordId = async (discord_id, preset, callback) => {

    if (await redisClient.exists(discord_id) === 0) {

        return callback('error')
    }

    let res = await redisClient.get(discord_id);
    res = strToObj(res);

    let initLength = res.accounts.length;
    let endLength = initLength;

    if (initLength <= preset) {

        return callback('error')
    }

    res.accounts.splice(preset, 1);

    endLength = res.accounts.length;

    res = objToStr(res);

    await redisClient.set(discord_id, res);

    return callback(initLength-endLength);

}

// module.exports.updatePresetByDiscordId = (discord_id, preset, platform, search, vanity, callback) => {
//     mysqlCli.getSession()
//         .then(session => {
//             const table = session.getSchema(schemaName).getTable(tableName);
//             table.select().where(`discord_id == :value`).bind('value', discord_id).execute().then(results => {
//                 let ara = results.toArray();
//                 if (ara.length < preset)
//                     return session.close().then(() => {
//                         return callback('error');
//                     });
//                 let toUpdate = ara[preset][0]
//                 table.update().where(`id == :value`).bind('value', toUpdate).set('platform', platform).set('search', search).set('vanity', vanity).execute().then(res => {
//                     return session.close().then(() => {
//                         return callback(res.getAffectedItemsCount());
//                     });
//                 });
//             });
//         });
// }

module.exports.addPresetByDiscordId = async (discord_id, platform, search, vanity, callback) => {


    if (await redisClient.exists(discord_id) === 0) {

        return callback('error')
    }

    let res = await redisClient.get(discord_id);
    res = strToObj(res);

    let initLength = res.accounts.length;
    let endLength = initLength;

    for (let i = 0; i < res.accounts.length; i++) {
        if (accountIsEqual(res.accounts[i],  platform, search, vanity))
            return callback('error');
    }

    res.accounts.push({platform, vanity, search})
    endLength = res.accounts.length;

    res = objToStr(res);

    await redisClient.set(discord_id, res);

    return callback(endLength-initLength);
}