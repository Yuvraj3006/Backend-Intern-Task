const pg = require("pg")
require('dotenv').config();


const db =  new pg.Client({
    user: 'neondb_owner',
    host: 'ep-wild-dawn-a7hpx5l6.ap-southeast-2.aws.neon.tech',
    database:'neondb',
    password:'SzH6Zqfrm1bI',
    port:5432,
    ssl: {
        rejectUnauthorized: false,
    },
});


module.exports = db;