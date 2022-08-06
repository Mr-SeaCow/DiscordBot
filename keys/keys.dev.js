require('dotenv').config();
module.exports = {
    token: process.env.BOT_TOKEN_DEV,
    application_id: process.env.BOT_APP_ID_DEV,
    guild_id: process.env.GUILD_ID_DEV,
    db_user: process.env.DATABASE_USER_DEV,
    db_pass: process.env.DATABASE_PASSWORD_DEV,
    db_schema: process.env.DATABASE_SCHEMA_DEV,
    db_table: process.env.DATABASE_TABLE_DEV
};
