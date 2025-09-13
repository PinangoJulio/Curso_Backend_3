import { Router } from 'express';
import { petsService } from '../services/index.js';

const router = Router();

// GET /api/pets - Obtener todas las mascotas
router.get('/', async (req, res) => {
    try {
        const pets = await petsService.getAll();
        res.send({ status: "success", payload: pets });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// POST /api/pets - Crear nueva mascota
router.post('/', async (req, res) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        
        const pet = {
            name,
            specie,
            birthDate,
            adopted: false
        };
        
        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// PUT /api/pets/:pid - Actualizar mascota
router.put('/:pid', async (req, res) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId, petUpdateBody);
        res.send({ status: "success", message: "Pet updated" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

// DELETE /api/pets/:pid - Eliminar mascota
router.delete('/:pid', async (req, res) => {
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        res.send({ status: "success", message: "Pet deleted" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

export default router;