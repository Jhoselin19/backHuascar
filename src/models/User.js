// user.js

const bcrypt = require('bcryptjs');
const connection = require('../database');

const User = {
  create: async function ({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const [result] = await connection.promise().execute(query, [username, email, hashedPassword]);
    return result;
  },
  findByUsername: async function (username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await connection.promise().execute(query, [username]);
    return rows[0];
  },
  validatePassword: async function (user, password) {
    return await bcrypt.compare(password, user.password);
  },
};

module.exports = User;
