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
const mysqlx = require('@mysql/xdevapi');
const keys = require('../../keys/keys')
const mysqlCli = mysqlx.getClient({ user: keys.db_user, password: keys.db_pass });
const schemaName = keys.db_schema;
const tableName =  keys.db_table;

module.exports.getAll = (callback) => {
    mysqlCli.getSession()
        .then(session => {
            const table = session.getSchema(schemaName).getTable(tableName);
            table.select().execute().then(results => {
                callback(results.toArray())
            })
        });
}

module.exports.getByDiscordId = (discord_id, callback) => {
    mysqlCli.getSession()
        .then(session => {
            const table = session.getSchema(schemaName).getTable(tableName);
            table.select('platform', 'vanity', 'search').where(`discord_id == :value`).bind('value', discord_id).execute().then(results => {
                return session.close().then(() => {
                    return callback(results.toArray());
                });
            });
        });
}

module.exports.deletePresetByDiscordId =(discord_id, preset, callback) => {
    mysqlCli.getSession()
        .then(session => {
            const table = session.getSchema(schemaName).getTable(tableName);
            table.select().where(`discord_id == :value`).bind('value', discord_id).execute().then(results => {
                let ara = results.toArray();
                if (!ara || ara.length <= preset)
                    return session.close().then(() => {
                        return callback('error');
                    });
                let toDelete = ara[preset][0]
                table.delete().where(`id == :value`).bind('value', toDelete).execute().then(res => {
                    return session.close().then(() => {
                        return callback(res.getAffectedItemsCount());
                    });
                });
            });
        });
}

module.exports.updatePresetByDiscordId = (discord_id, preset, platform, search, vanity, callback) => {
    mysqlCli.getSession()
        .then(session => {
            const table = session.getSchema(schemaName).getTable(tableName);
            table.select().where(`discord_id == :value`).bind('value', discord_id).execute().then(results => {
                let ara = results.toArray();
                if (ara.length < preset)
                    return session.close().then(() => {
                        return callback('error');
                    });
                let toUpdate = ara[preset][0]
                table.update().where(`id == :value`).bind('value', toUpdate).set('platform', platform).set('search', search).set('vanity', vanity).execute().then(res => {
                    return session.close().then(() => {
                        return callback(res.getAffectedItemsCount());
                    });
                });
            });
        });
}

module.exports.addPresetByDiscordId = (discord_id, platform, search, vanity, callback) => {
    mysqlCli.getSession()
        .then(session => {
            const table = session.getSchema(schemaName).getTable(tableName);
            table.insert('discord_id', 'platform', 'vanity', 'search')
                .values([discord_id, platform, vanity, search])
                .execute().then(res => {
                    return session.close().then(() => {
                        return callback(res.getAffectedItemsCount());
                    });
                });
        });
}