import { Router } from 'express';
import { generateUsers, generatePets } from '../utils/mockGenerator.js';
import User from '../dao/models/user.model.js';
import Pet from '../dao/models/pet.model.js';

const router = Router();

router.get('/mockingpets', async (req, res) => {
    try {
        const pets = generatePets(100);
        res.status(200).json({
            status: 'success',
            payload: pets
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error generando mascotas mock',
            error: error.message
        });
    }
});

router.get('/mockingusers', async (req, res) => {
    try {
        const users = await generateUsers(50); 
        res.status(200).json({
            status: 'success',
            payload: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error generando usuarios mock',
            error: error.message
        });
    }
});

router.post('/generateData', async (req, res) => {
    try {
        // Obtener parámetros desde query parameters Y desde body
        let { user, users, pet, pets } = req.query;
        const bodyParams = req.body;

        // Permitir parámetros desde body también
        const finalUsers = parseInt(user || users || bodyParams.users || bodyParams.user || 1);
        const finalPets = parseInt(pet || pets || bodyParams.pets || bodyParams.pet || 1);

        // Validar que sean números positivos
        if (finalUsers < 0 || finalPets < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros users y pets deben ser números positivos'
            });
        }

        const results = {
            usersInserted: 0,
            petsInserted: 0
        };

        // Generar usuarios
        if (finalUsers > 0) {
            const mockUsers = await generateUsers(finalUsers);
            const insertedUsers = await User.insertMany(mockUsers);
            results.usersInserted = insertedUsers.length;
        }

        // Generar mascotas
        if (finalPets > 0) {
            const mockPets = generatePets(finalPets);
            const insertedPets = await Pet.insertMany(mockPets);
            results.petsInserted = insertedPets.length;
        }

        res.status(201).json({
            status: 'success',
            message: 'Datos generados exitosamente',
            payload: results
        });

    } catch (error) {
        console.error('Error en generateData:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error generando e insertando datos',
            error: error.message
        });
    }
});

export default router;