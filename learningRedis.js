const {createClient} = require('redis');

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));


//'discord_id', 'platform', 'vanity', 'search'
async function main() {
    await client.connect();

    let exists = await client.exists('176532282935345153')
    // await client.set('176532282935345153', JSON.stringify({
    //     'accounts': [{
    //             'platform': 'STEAM',
    //             'vanity': 76561198872429604,
    //             'search': 'mrseacow'
    //         }
    //     ]
    // }));
    const value = await client.get('176532282935345153');
    let t = JSON.parse(value);

    console.log(t.accounts)
    await client.disconnect()
}   

main();
