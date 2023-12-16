const { Router } = require('express');
const router = Router();
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('./verifyToken');
const User = require('../models/User');
const path = require('path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/signup', async (req, res, next) => {
    try {
        const { Nombre, Apellido, DNI, Telefono, Genero, FechaNacimiento, Contraseña } = req.body;
        const user = await User.create({
            Nombre: Nombre,
            Apellido: Apellido,
            DNI: DNI,
            Telefono: Telefono,
            Genero: Genero,
            FechaNacimiento: FechaNacimiento,
            Contraseña: Contraseña
        });

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 60 * 60 * 24,
        });

        res.sendFile(path.join(__dirname, '../public/register.html'));

    } catch (error) {
        next(error);
    }
});

router.get('/dashboard', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, { attributes: { exclude: ['password'] } });
        if (!user) {
            return res.status(404).send('No user found....!!!');
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.post('/signin', async (req, res, next) => {
    try {
        const { DNI, Contraseña } = req.body;
        const user = await User.findByUsername(parseInt(DNI));

        if (!user) {
            return res.status(404).send("The user doesn't exist");
        }

        const validPassword = await User.validatePassword(user, Contraseña);

        if (!validPassword) {
            return res.status(401).json({ auth: false, token: null });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 60 * 60 * 24,
        });

        res.sendFile(path.join(__dirname, '../public/index.html'));

    } catch (error) {
        next(error);
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

router.use(express.static(path.join(__dirname, '../public')));

module.exports = router;