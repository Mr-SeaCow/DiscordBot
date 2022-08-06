module.exports.links = {
    icons: {
        'steam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/1000px-Steam_icon_logo.svg.png',
        'psn': 'https://cdn.discordapp.com/attachments/429036941254721547/486376807730380810/unknown.png',
        'xbl': 'https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/XBox_360.png',
        'epic': 'https://cdn.discordapp.com/attachments/524352963594944512/809643939547447296/ddnzlss-c929df6d-d199-44d2-a8cb-5e71a921ee23.png',
        'switch': 'https://www.logolynx.com/images/logolynx/b7/b7f5dec9ef53e30d8ca0d844a8688c43.png'
    },
    tracker: {
        'START': 'https://rocketleague-beta.tracker.network/rocket-league/profile/',
        'END': '/overview'
    },
    avatar: 'http://orig02.deviantart.net/f865/f/2012/121/4/9/transparent__blank__by_madhatter2408-d4y5rky.png'
};
module.exports.setupCase = ['ADD', 'DEL', 'SET', 'LIS', 'HEL'];
module.exports.possiblePlatforms = ['xbox', 'ps4', 'ps','psn', 'steam', 'pc', 'epic', 'switch'];
module.exports.searchTypes = ['NORM', 'MIN', 'FULL', 'STAT', 'STATS'];
module.exports.rankHeaderReplacementsOld = ['Solo Duels', 'Doubles', 'Solo Standards', 'Standards',
    'Hoops', 'Rumble', 'Dropshot', 'Snow Day'];

module.exports.rankHeaderReplacements = {
    0: "Unranked",
    10: "Solo Duels",
    11: "Doubles",
    13: "Standard",
    27: "Hoops",
    28: "Rumble",
    29: "Dropshot",
    30: "Snowday",
    34: "Tournament"
}

module.exports.statTitles = ['GoalShotRatio', 'Wins', 'Goals', 'Saves', 'Shots', 'MVPs', 'Assists']

module.exports.statHeader = [
    ['Wins', 'Wins'],
    ['Goals', 'Goals'],
    ['MVPs', 'MVPs'],
    ['Saves','Saves'],
    ['Shots', 'Shots'],
    ['Assists', 'Assists'],
    ['GoalShotRatio', 'Shot %'],
    ['MvpWinRatio', 'MVP %'],
]