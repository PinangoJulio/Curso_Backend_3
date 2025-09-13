import { Router } from 'express';
import { adoptionsService, petsService, usersService } from '../services/index.js';

const router = Router();

// GET /api/adoptions - Obtener todas las adopciones
router.get('/', async (req, res) => {
    try {
        const result = await adoptionsService.getAll();
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// GET /api/adoptions/:aid - Obtener adopción por ID
router.get('/:aid', async (req, res) => {
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({ _id: adoptionId });
        if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" });
        res.send({ status: "success", payload: adoption });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// POST /api/adoptions/:uid/:pid - Crear nueva adopción
router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;
        
        const user = await usersService.getUserById(uid);
        if (!user) return res.status(404).send({ status: "error", error: "user Not found" });
        
        const pet = await petsService.getBy({ _id: pid });
        if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
        
        if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });
        
        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets });
        await petsService.update(pet._id, { adopted: true, owner: user._id });
        await adoptionsService.create({ owner: user._id, pet: pet._id });
        
        res.send({ status: "success", message: "Pet adopted" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

export default router;