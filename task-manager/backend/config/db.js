const mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

pool.getConnection()
  .then(conn => {
    console.log('Connected to database');
    conn.release();
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

module.exports = pool;
