import { Router } from 'express';
import { generateUsers, generatePets } from '../utils/mockGenerator.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

// Endpoint para generar mascotas mock
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

// Endpoint para generar usuarios mock
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

// Endpoint para generar e insertar datos en la base de datos
router.post('/generateData', async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        // Validación de parámetros
        if (typeof users !== 'number' || typeof pets !== 'number' || users < 0 || pets < 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Los parámetros users y pets deben ser números positivos'
            });
        }

        const results = {
            usersInserted: 0,
            petsInserted: 0
        };

        // Generar e insertar usuarios
        if (users > 0) {
            const mockUsers = await generateUsers(users);
            
            for (const userData of mockUsers) {
                try {
                    await usersService.create(userData);
                    results.usersInserted++;
                } catch (error) {
                    console.error('Error insertando usuario:', error);
                }
            }
        }

        // Generar e insertar mascotas
        if (pets > 0) {
            const mockPets = generatePets(pets);
            
            for (const petData of mockPets) {
                try {
                    await petsService.create(petData);
                    results.petsInserted++;
                } catch (error) {
                    console.error('Error insertando mascota:', error);
                }
            }
        }

        res.status(201).json({
            status: 'success',
            message: 'Datos generados e insertados correctamente',
            payload: results
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error generando e insertando datos',
            error: error.message
        });
    }
});

export default router;