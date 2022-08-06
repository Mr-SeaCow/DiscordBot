const { rank, rankOld, rankNew } = require('../../data/rl/ranks');


module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    client.rank = rank;
    client.rankNew = rankNew;
    client.rankOld = rankOld;
    client.rankEmoji = [];
    client.rankEmojiNew = [];
    client.rankEmojiOld = [];

    for (const i in rank) {
        client.rankEmoji.push(client.emojis.cache.get(rank[i].id));
    }

    for (const i in rankNew) {
        client.rankEmojiNew.push(client.emojis.cache.get(rankNew[i].id));
    }

    for (const i in rankOld) {
        client.rankEmojiOld.push(client.emojis.cache.get(rankOld[i].id));
    }

}