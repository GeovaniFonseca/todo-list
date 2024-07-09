const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  createUser: async (user) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const res = await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', [user.username, hashedPassword]);
      return res.insertId;
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  },
  getUserByUsername: async (username) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
};

module.exports = User;
