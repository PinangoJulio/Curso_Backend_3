import { Router } from 'express';
import { usersService } from '../services/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/sessions/register - Registrar usuario
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        
        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            pets: []
        };
        
        let result = await usersService.create(user);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// POST /api/sessions/login - Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        
        const user = await usersService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "User doesn't exist" });
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).send({ status: "error", error: "Incorrect password" });
        
        const userDto = {
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            email: user.email
        };
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });
        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({ status: "success", message: "Logged in" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// GET /api/sessions/current - Usuario actual
router.get('/current', async (req, res) => {
    try {
        const cookie = req.cookies['coderCookie'];
        const user = jwt.verify(cookie, 'tokenSecretJWT');
        if (user) return res.send({ status: "success", payload: user });
    } catch (error) {
        res.status(401).send({ status: "error", error: "Invalid token" });
    }
});

export default router;