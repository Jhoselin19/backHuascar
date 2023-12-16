// user.js

const bcrypt = require('bcryptjs');
const connection = require('../database');

const User = {
  create: async function ({ Nombre, Apellido, DNI, Telefono, Genero, FechaNacimiento, Contraseña  }) {
    const hashedPassword = await bcrypt.hash(Contraseña, 10);
    const query = 'INSERT INTO users (Nombre, Apellido, DNI, Telefono, Genero, FechaNacimiento, Contraseña) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.promise().execute(query, [Nombre, Apellido, DNI, Telefono, Genero, FechaNacimiento, hashedPassword]);
    return result;
  },
  findByUsername: async function (dni) {
    const query = 'SELECT * FROM users WHERE DNI = ?';
    const [rows] = await connection.promise().execute(query, [dni]);
    return rows[0];
  },
  validatePassword: async function (DNI, Contraseña) {
    return await bcrypt.compare(Contraseña, DNI.Contraseña);
  },
};

module.exports = User;
