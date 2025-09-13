import { Router } from 'express';
import { usersService } from '../services/index.js';

const router = Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.send({ status: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// GET /api/users/:uid - Obtener usuario por ID
router.get('/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });
        res.send({ status: "success", payload: user });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// PUT /api/users/:uid - Actualizar usuario
router.put('/:uid', async (req, res) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });
        
        const result = await usersService.update(userId, updateBody);
        res.send({ status: "success", message: "User updated" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// DELETE /api/users/:uid - Eliminar usuario
router.delete('/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });
        
        const result = await usersService.delete(userId);
        res.send({ status: "success", message: "User deleted" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

export default router;