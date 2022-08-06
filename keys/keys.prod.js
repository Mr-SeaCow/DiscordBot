require('dotenv').config();
module.exports = {
    token: process.env.BOT_TOKEN_PROD,
    application_id: process.env.BOT_APP_ID_PROD,
    guild_id: process.env.GUILD_ID_PROD,
    db_user: process.env.DATABASE_USER_PROD,
    db_pass: process.env.DATABASE_PASSWORD_PROD,
    db_schema: process.env.DATABASE_SCHEMA_PROD,
    db_table: process.env.DATABASE_TABLE_PROD
};
