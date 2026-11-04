
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = 3000;

const localUsersFile = path.join(__dirname, 'data', 'users.json');
const frontendDirectory = path.join(__dirname, '..', 'frontend');

let useMongoStorage = false;

const normalizeEmail = (email) => email.trim().toLowerCase();

// Leer usuarios del almacenamiento local
async function readLocalUsers() {
    try {
        const users = await fs.readFile(localUsersFile, 'utf8');
        return JSON.parse(users);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

// Guardar usuarios en almacenamiento local
async function writeLocalUsers(users) {
    await fs.mkdir(path.dirname(localUsersFile), {
        recursive: true
    });

    await fs.writeFile(
        localUsersFile,
        JSON.stringify(users, null, 2)
    );
}

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión mediante variable de entorno
const MONGODB_URI = process.env.MONGODB_URI;

// Verificar estado del servidor
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// REGISTRO DE USUARIOS
app.post('/api/register', async (req, res) => {
    try {
        const body = req.body || {};

        const name = typeof body.name === 'string'
            ? body.name.trim()
            : '';

        const email = typeof body.email === 'string'
            ? normalizeEmail(body.email)
            : '';

        const password = body.password;

        if (!name || !email || typeof password !== 'string' || !password) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Comprobar correo duplicado en el almacenamiento activo
        if (useMongoStorage) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    error: 'El correo ya está registrado'
                });
            }
        } else {
            const localUsers = await readLocalUsers();

            if (localUsers.some(user => user.email === email)) {
                return res.status(409).json({
                    error: 'El correo ya está registrado'
                });
            }
        }

        // Cifrar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar usuario
        if (useMongoStorage) {
            await new User({
                name,
                email,
                password: hashedPassword
            }).save();
        } else {
            const localUsers = await readLocalUsers();

            localUsers.push({
                name,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            });

            await writeLocalUsers(localUsers);
        }

        return res.status(201).json({
            message: 'Usuario registrado con éxito',
            user: { name, email }
        });

    } catch (error) {
        console.error('Error en el registro:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                error: 'El correo ya está registrado'
            });
        }

        return res.status(500).json({
            error: 'Error en el servidor'
        });
    }
});

// INICIO DE SESIÓN
app.post('/api/login', async (req, res) => {
    try {
        const body = req.body || {};

        const email = typeof body.email === 'string'
            ? normalizeEmail(body.email)
            : '';

        const password = body.password;

        if (!email || typeof password !== 'string' || !password) {
            return res.status(400).json({
                error: 'Correo y contraseña son obligatorios'
            });
        }

        // Buscar usuario en el almacenamiento activo
        let user;
        let localUsers = [];

        if (useMongoStorage) {
            user = await User.findOne({ email });
        } else {
            localUsers = await readLocalUsers();

            user = localUsers.find(
                localUser => localUser.email === email
            );
        }

        if (!user || typeof user.password !== 'string') {
            return res.status(400).json({
                error: 'Credenciales inválidas'
            });
        }

        // Comprobar si la contraseña ya está cifrada
        const isHashed = /^\$2[aby]\$/.test(user.password);

        let passwordMatches = false;

        if (isHashed) {
            passwordMatches = await bcrypt.compare(
                password,
                user.password
            );
        } else {
            // Compatibilidad con usuarios antiguos
            passwordMatches = user.password === password;

            // Cifrar contraseña antigua después de validar
            if (passwordMatches) {
                const hashedPassword = await bcrypt.hash(password, 10);

                user.password = hashedPassword;

                if (useMongoStorage) {
                    await user.save();
                } else {
                    await writeLocalUsers(localUsers);
                }
            }
        }

        if (!passwordMatches) {
            return res.status(400).json({
                error: 'Credenciales inválidas'
            });
        }

        return res.json({
            message: 'Inicio de sesión exitoso',
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);

        return res.status(500).json({
            error: 'Error en el servidor'
        });
    }
});

// Servir archivos del frontend
app.use(express.static(frontendDirectory));

// Iniciar servidor
async function startServer() {
    if (MONGODB_URI) {
        try {
            await mongoose.connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
                family: 4
            });

            useMongoStorage = true;

            console.log('Conectado exitosamente a MongoDB Atlas');

        } catch (error) {
            console.log(
                'Error al conectar con Atlas. Se utilizará almacenamiento local:',
                error.message
            );
        }
    } else {
        console.log(
            'No se configuró MONGODB_URI. Se utilizará almacenamiento local.'
        );
    }

    app.listen(PORT, () => {
        console.log('Servidor corriendo en http://localhost:' + PORT);
    });
}

startServer();
