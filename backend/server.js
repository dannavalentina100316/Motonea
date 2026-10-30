const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = 3000;
const localUsersFile = path.join(__dirname, 'data', 'users.json');
const frontendDirectory = path.join(__dirname, '..', 'frontend');
let useMongoStorage = false;

const normalizeEmail = (email) => email.trim().toLowerCase();

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

async function writeLocalUsers(users) {
    await fs.mkdir(path.dirname(localUsersFile), { recursive: true });
    await fs.writeFile(localUsersFile, JSON.stringify(users, null, 2));
}

// Middlewares
app.use(express.json());
app.use(cors());

// Conexión directa heredada de MongoDB Atlas para omitir bloqueos DNS/ISP
const MONGODB_URI = 'mongodb://adminmotor:danna1426682@ac-azchuq4-shard-00-00.cvfcd3w.mongodb.net:27017,ac-azchuq4-shard-00-01.cvfcd3w.mongodb.net:27017,ac-azchuq4-shard-00-02.cvfcd3w.mongodb.net:27017/motorapp_db?ssl=true&replicaSet=atlas-xydy6c-shard-0&authSource=admin&retryWrites=true&w=majority';

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Ruta de Registro
app.post('/api/register', async (req, res) => {
    try {
        const { password } = req.body;
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        const email = typeof req.body.email === 'string' ? normalizeEmail(req.body.email) : '';

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const localUsers = await readLocalUsers();
        if (localUsers.some((user) => user.email === email)) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }

        if (useMongoStorage) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: 'El correo ya está registrado' });
            }

            await new User({ name, email, password }).save();
        } else {
            localUsers.push({ name, email, password, createdAt: new Date().toISOString() });
            await writeLocalUsers(localUsers);
        }

        res.status(201).json({ message: 'Usuario registrado con éxito', user: { name, email } });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta de Login
app.post('/api/login', async (req, res) => {
    try {
        const { password } = req.body;
        const email = typeof req.body.email === 'string' ? normalizeEmail(req.body.email) : '';

        const mongoUser = useMongoStorage ? await User.findOne({ email }) : null;
        const user = mongoUser || (await readLocalUsers()).find((localUser) => localUser.email === email);
        
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        res.json({ message: 'Inicio de sesión exitoso', user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.use(express.static(frontendDirectory));

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        useMongoStorage = true;
        console.log('✅ Conectado exitosamente a MongoDB Atlas');
    } catch (error) {
        console.log('⚠️ Error al conectar con Atlas, usando almacenamiento local:', error.message);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}

startServer();